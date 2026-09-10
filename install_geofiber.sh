#!/usr/bin/env bash

set -Eeuo pipefail

umask 077

VERSION="1.1.2"

SCRIPT_DIR="$(
    cd "$(
        dirname "${BASH_SOURCE[0]}"
    )" &&
    pwd
)"

APP_DIR="$SCRIPT_DIR"

MODE="${1:-install}"

NODE_MAJOR="${GEOFIBER_NODE_MAJOR:-22}"
PNPM_VERSION="${GEOFIBER_PNPM_VERSION:-10.0.0}"

POSTGIS_IMAGE="${GEOFIBER_POSTGIS_IMAGE:-postgis/postgis:16-3.4}"

REDIS_IMAGE="${GEOFIBER_REDIS_IMAGE:-redis:7-alpine}"

DB_CONTAINER="${GEOFIBER_DB_CONTAINER:-geofiber_db}"

REDIS_CONTAINER="${GEOFIBER_REDIS_CONTAINER:-geofiber_redis}"

DB_VOLUME="${GEOFIBER_DB_VOLUME:-geofiber_db_data}"

REDIS_VOLUME="${GEOFIBER_REDIS_VOLUME:-geofiber_redis_data}"

ENV_DIR="/etc/geofiber"
ENV_FILE="$ENV_DIR/geofiber.env"

LOG_DIR="/var/log/geofiber"

TEST_CONTAINER=""


banner() {
    echo
    echo "============================================================"
    echo "$*"
    echo "============================================================"
}


info() {
    echo "[INFO] $*"
}


ok() {
    echo "[OK] $*"
}


warn() {
    echo "[WARN] $*" >&2
}


die() {
    echo "[ERRO] $*" >&2
    exit 1
}


command_exists() {
    command -v "$1" >/dev/null 2>&1
}


require_root() {
    if [ "$(id -u)" -ne 0 ]; then
        die "Execute como root."
    fi
}


check_repository() {

    local required=(
        "package.json"
        "pnpm-lock.yaml"
        "pnpm-workspace.yaml"

        "apps/api/package.json"
        "apps/api/prisma/schema.prisma"
        "apps/api/prisma/migrations/000000000000_clean_baseline/migration.sql"
        "apps/api/prisma/migrations/migration_lock.toml"
        "apps/api/src/main.ts"

        "apps/portal/package.json"
        "apps/portal/src/app/layout.tsx"

        "ecosystem.config.cjs"
    )

    for file in "${required[@]}"
    do
        if [ ! -f "$APP_DIR/$file" ]; then
            die \
                "Arquivo obrigatorio ausente: $file"
        fi
    done

    local migration_count=""

    migration_count="$(
        find \
            "$APP_DIR/apps/api/prisma/migrations" \
            -type f \
            -name migration.sql |
        wc -l |
        tr -d '[:space:]'
    )"

    if [ "$migration_count" != "1" ]; then
        die \
            "Release oficial deve conter exatamente 1 baseline. Encontrado: $migration_count"
    fi

    ok \
        "Repositorio GeoFiber reconhecido."
}


setup_log() {

    mkdir -p "$LOG_DIR"

    LOG_FILE="$LOG_DIR/install-$(date +%Y%m%d-%H%M%S).log"

    exec > >(tee -a "$LOG_FILE") 2>&1

    echo "LOG_FILE=$LOG_FILE"
}


install_system_packages() {

    banner \
        "01. PACOTES BASE"

    export DEBIAN_FRONTEND=noninteractive

    apt-get update

    apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        git \
        jq \
        openssl \
        nginx \
        docker.io \
        build-essential \
        python3 \
        iproute2

    systemctl enable --now docker
    systemctl enable --now nginx

    ok \
        "Pacotes do sistema instalados."
}


install_node() {

    banner \
        "02. NODE.JS ${NODE_MAJOR}"

    local current_major=""

    if command_exists node; then
        current_major="$(
            node -p \
                'process.versions.node.split(".")[0]'
        )"
    fi

    if [ "$current_major" != "$NODE_MAJOR" ]; then

        curl \
            -fsSL \
            "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" \
            -o /tmp/geofiber-nodesource.sh

        bash \
            /tmp/geofiber-nodesource.sh

        rm -f \
            /tmp/geofiber-nodesource.sh

        apt-get install -y \
            nodejs
    fi

    local installed_major=""

    installed_major="$(
        node -p \
            'process.versions.node.split(".")[0]'
    )"

    if [ "$installed_major" != "$NODE_MAJOR" ]; then
        die \
            "Node ${NODE_MAJOR}.x nao foi instalado corretamente."
    fi

    npm install -g \
        "pnpm@${PNPM_VERSION}" \
        pm2

    hash -r

    echo "NODE=$(node --version)"
    echo "NPM=$(npm --version)"
    echo "PNPM=$(pnpm --version)"
    echo "PM2=$(pm2 --version)"

    ok \
        "Node/pnpm/PM2 prontos."
}


port_in_use() {

    local port="$1"

    ss -lnt \
        2>/dev/null |
    awk '{print $4}' |
    grep -Eq \
        "(:|\\])${port}$"
}


load_existing_env() {

    if [ -f "$ENV_FILE" ]; then

        set -a

        # shellcheck disable=SC1090
        source "$ENV_FILE"

        set +a
    fi
}


prepare_environment() {

    banner \
        "03. CONFIGURACAO"

    mkdir -p \
        "$ENV_DIR"

    load_existing_env

    DOMAIN="${GEOFIBER_DOMAIN:-${DOMAIN:-geofibers.com.br}}"

    PANEL_DOMAIN="${GEOFIBER_PANEL_DOMAIN:-${PANEL_DOMAIN:-painel.geofibers.com.br}}"

    API_DOMAIN="${GEOFIBER_API_DOMAIN:-${API_DOMAIN:-api.geofibers.com.br}}"

    API_PORT="${GEOFIBER_API_PORT:-${API_PORT:-3001}}"

    PORTAL_PORT="${GEOFIBER_PORTAL_PORT:-${PORTAL_PORT:-3000}}"

    DB_HOST="127.0.0.1"
    DB_PORT="${DB_PORT:-5432}"
    DB_NAME="${DB_NAME:-geofiber}"
    DB_USER="${DB_USER:-geofiber}"

    REDIS_HOST="127.0.0.1"
    REDIS_PORT="${REDIS_PORT:-6379}"

    if [ -z "${DB_PASSWORD:-}" ]; then

        if docker container inspect \
            "$DB_CONTAINER" \
            >/dev/null 2>&1
        then
            die \
                "Banco existente detectado, mas DB_PASSWORD nao existe em $ENV_FILE"
        fi

        DB_PASSWORD="$(
            openssl rand -hex 24
        )"
    fi

    if [ -z "${JWT_SECRET:-}" ]; then
        JWT_SECRET="$(
            openssl rand -hex 48
        )"
    fi

    JWT_EXPIRES_IN="${JWT_EXPIRES_IN:-7d}"

    NEXT_PUBLIC_API_URL="${GEOFIBER_API_PUBLIC_URL:-https://${API_DOMAIN}}"

    UPLOAD_MAX_SIZE_GED="${UPLOAD_MAX_SIZE_GED:-52428800}"

    UPLOAD_MAX_SIZE_TRAINING="${UPLOAD_MAX_SIZE_TRAINING:-52428800}"

    STRIPE_SECRET_KEY="${GEOFIBER_STRIPE_SECRET_KEY:-${STRIPE_SECRET_KEY:-}}"

    PNPM_BIN="$(
        command -v pnpm
    )"

    DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

    cat > "$ENV_FILE" <<EOF
NODE_ENV=production

APP_DIR=$APP_DIR

API_PORT=$API_PORT
PORTAL_PORT=$PORTAL_PORT

DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

DATABASE_URL=$DATABASE_URL

REDIS_HOST=$REDIS_HOST
REDIS_PORT=$REDIS_PORT

JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=$JWT_EXPIRES_IN

NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

UPLOAD_MAX_SIZE_GED=$UPLOAD_MAX_SIZE_GED
UPLOAD_MAX_SIZE_TRAINING=$UPLOAD_MAX_SIZE_TRAINING

STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY

DOMAIN=$DOMAIN
PANEL_DOMAIN=$PANEL_DOMAIN
API_DOMAIN=$API_DOMAIN

PNPM_BIN=$PNPM_BIN
EOF

    chmod 600 \
        "$ENV_FILE"

    ln -sfn \
        "$ENV_FILE" \
        "$APP_DIR/.env"

    ln -sfn \
        "$ENV_FILE" \
        "$APP_DIR/apps/api/.env"

    cat > \
        "$APP_DIR/apps/portal/.env.production" \
        <<EOF
NODE_ENV=production
NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
EOF

    chmod 600 \
        "$APP_DIR/apps/portal/.env.production"

    echo "ENV_FILE=$ENV_FILE"
    echo "SECRETS_PRINTED=NAO"

    ok \
        "Ambiente preparado."
}


prepare_database() {

    banner \
        "04. POSTGRESQL 16 + POSTGIS"

    if docker container inspect \
        "$DB_CONTAINER" \
        >/dev/null 2>&1
    then

        info \
            "Container $DB_CONTAINER ja existe."

        docker start \
            "$DB_CONTAINER" \
            >/dev/null \
            2>&1 \
            || true

    else

        if port_in_use "$DB_PORT"; then
            die \
                "Porta PostgreSQL ${DB_PORT} ja esta ocupada."
        fi

        docker volume create \
            "$DB_VOLUME" \
            >/dev/null

        docker pull \
            "$POSTGIS_IMAGE"

        docker run \
            -d \
            --name "$DB_CONTAINER" \
            --restart unless-stopped \
            -e "POSTGRES_DB=$DB_NAME" \
            -e "POSTGRES_USER=$DB_USER" \
            -e "POSTGRES_PASSWORD=$DB_PASSWORD" \
            -p "127.0.0.1:${DB_PORT}:5432" \
            -v "${DB_VOLUME}:/var/lib/postgresql/data" \
            "$POSTGIS_IMAGE" \
            >/dev/null
    fi

    local ready=0

    for n in $(seq 1 60)
    do

        if docker exec \
            "$DB_CONTAINER" \
            pg_isready \
            -U "$DB_USER" \
            -d "$DB_NAME" \
            >/dev/null 2>&1
        then

            ready=1
            break
        fi

        sleep 2
    done

    if [ "$ready" -ne 1 ]; then

        docker logs \
            "$DB_CONTAINER" \
            --tail 150 \
            || true

        die \
            "PostgreSQL nao ficou pronto."
    fi

    ok \
        "PostgreSQL pronto para receber a baseline."
}


prepare_redis() {

    banner \
        "05. REDIS 7"

    if docker container inspect \
        "$REDIS_CONTAINER" \
        >/dev/null 2>&1
    then

        docker start \
            "$REDIS_CONTAINER" \
            >/dev/null \
            2>&1 \
            || true

    else

        if port_in_use "$REDIS_PORT"; then
            die \
                "Porta Redis ${REDIS_PORT} ja esta ocupada."
        fi

        docker volume create \
            "$REDIS_VOLUME" \
            >/dev/null

        docker pull \
            "$REDIS_IMAGE"

        docker run \
            -d \
            --name "$REDIS_CONTAINER" \
            --restart unless-stopped \
            -p "127.0.0.1:${REDIS_PORT}:6379" \
            -v "${REDIS_VOLUME}:/data" \
            "$REDIS_IMAGE" \
            redis-server \
            --appendonly yes \
            >/dev/null
    fi

    for n in $(seq 1 30)
    do

        if docker exec \
            "$REDIS_CONTAINER" \
            redis-cli ping \
            2>/dev/null |
            grep -q PONG
        then

            ok \
                "Redis operacional."

            return 0
        fi

        sleep 1
    done

    die \
        "Redis nao respondeu."
}


install_dependencies() {

    banner \
        "06. DEPENDENCIAS"

    cd "$APP_DIR"

    pnpm install \
        --frozen-lockfile

    pnpm rebuild \
        @prisma/engines \
        @prisma/client \
        prisma

    ok \
        "Dependencias instaladas."
}


run_prisma() {

    banner \
        "07. PRISMA BASELINE"

    cd "$APP_DIR"

    export DATABASE_URL

    pnpm \
        --dir apps/api \
        exec prisma generate \
        --schema prisma/schema.prisma

    DATABASE_URL="$DATABASE_URL" \
    pnpm \
        --dir apps/api \
        exec prisma validate \
        --schema prisma/schema.prisma

    DATABASE_URL="$DATABASE_URL" \
    pnpm \
        --dir apps/api \
        exec prisma migrate deploy \
        --schema prisma/schema.prisma

    DATABASE_URL="$DATABASE_URL" \
    pnpm \
        --dir apps/api \
        exec prisma migrate status \
        --schema prisma/schema.prisma

    local postgis_version=""

    postgis_version="$(
        docker exec \
            "$DB_CONTAINER" \
            psql \
            -U "$DB_USER" \
            -d "$DB_NAME" \
            -Atc \
            'SELECT PostGIS_Version();' |
        head -n1
    )"

    if [ -z "$postgis_version" ]; then
        die \
            "Baseline nao habilitou PostGIS."
    fi

    echo "POSTGIS_VERSION=$postgis_version"

    ok \
        "Prisma baseline aplicada."
}


build_application() {

    banner \
        "08. BUILD"

    cd "$APP_DIR"

    set -a

    # shellcheck disable=SC1090
    source "$ENV_FILE"

    set +a

    pnpm \
        --dir apps/api \
        build

    NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
    pnpm \
        --dir apps/portal \
        build

    mkdir -p \
        "$APP_DIR/apps/api/uploads"

    ok \
        "API e Portal compilados."
}


configure_pm2() {

    banner \
        "09. PM2"

    cd "$APP_DIR"

    pm2 delete \
        geofiber-api \
        >/dev/null 2>&1 \
        || true

    pm2 delete \
        geofiber-portal \
        >/dev/null 2>&1 \
        || true

    GEOFIBER_ENV_FILE="$ENV_FILE" \
    pm2 start \
        "$APP_DIR/ecosystem.config.cjs"

    pm2 save

    pm2 startup \
        systemd \
        -u root \
        --hp /root \
        >/dev/null 2>&1 \
        || true

    pm2 save

    pm2 status

    ok \
        "PM2 configurado."
}


configure_nginx() {

    banner \
        "10. NGINX"

    cat > \
        /etc/nginx/sites-available/geofiber-portal \
        <<EOF
server {
    listen 80;
    listen [::]:80;

    server_name
        ${DOMAIN}
        www.${DOMAIN}
        ${PANEL_DOMAIN};

    client_max_body_size 100m;

    location / {
        proxy_pass http://127.0.0.1:${PORTAL_PORT};

        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

    cat > \
        /etc/nginx/sites-available/geofiber-api \
        <<EOF
server {
    listen 80;
    listen [::]:80;

    server_name ${API_DOMAIN};

    client_max_body_size 100m;

    location / {
        proxy_pass http://127.0.0.1:${API_PORT};

        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

    ln -sfn \
        /etc/nginx/sites-available/geofiber-portal \
        /etc/nginx/sites-enabled/geofiber-portal

    ln -sfn \
        /etc/nginx/sites-available/geofiber-api \
        /etc/nginx/sites-enabled/geofiber-api

    rm -f \
        /etc/nginx/sites-enabled/default

    nginx -t

    systemctl reload nginx

    ok \
        "Nginx configurado."
}


configure_ssl() {

    banner \
        "11. SSL"

    if [ "${GEOFIBER_ENABLE_SSL:-0}" != "1" ]; then

        warn \
            "SSL automatico desativado."

        warn \
            "Depois que o DNS apontar para esta VPS, use GEOFIBER_ENABLE_SSL=1."

        return 0
    fi

    local email="${GEOFIBER_SSL_EMAIL:-}"

    if [ -z "$email" ]; then
        warn \
            "GEOFIBER_SSL_EMAIL nao informado. SSL ignorado."
        return 0
    fi

    apt-get install -y \
        certbot \
        python3-certbot-nginx

    certbot \
        --nginx \
        --non-interactive \
        --agree-tos \
        --redirect \
        --email "$email" \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        -d "$PANEL_DOMAIN"

    certbot \
        --nginx \
        --non-interactive \
        --agree-tos \
        --redirect \
        --email "$email" \
        -d "$API_DOMAIN"

    nginx -t

    systemctl reload nginx

    ok \
        "SSL configurado."
}


wait_http() {

    local url="$1"
    local label="$2"

    for n in $(seq 1 60)
    do

        if curl \
            -fsS \
            --max-time 3 \
            "$url" \
            >/dev/null 2>&1
        then

            ok \
                "$label respondeu."

            return 0
        fi

        sleep 2
    done

    return 1
}


health_checks() {

    banner \
        "12. HEALTH CHECK"

    wait_http \
        "http://127.0.0.1:${API_PORT}/health" \
        "API" \
        || die \
            "API nao respondeu."

    wait_http \
        "http://127.0.0.1:${PORTAL_PORT}/login" \
        "Portal" \
        || die \
            "Portal nao respondeu."

    docker exec \
        "$DB_CONTAINER" \
        pg_isready \
        -U "$DB_USER" \
        -d "$DB_NAME"

    docker exec \
        "$REDIS_CONTAINER" \
        redis-cli ping

    ok \
        "Health checks concluidos."
}


show_result() {

    banner \
        "GEOFIBER INSTALADO"

    echo "INSTALLER_VERSION=$VERSION"
    echo "APP_DIR=$APP_DIR"

    echo
    echo "Portal:"
    echo "  https://${DOMAIN}"
    echo "  https://${PANEL_DOMAIN}"

    echo
    echo "API:"
    echo "  https://${API_DOMAIN}"

    echo
    echo "ENV:"
    echo "  $ENV_FILE"

    echo
    echo "Segredos exibidos: NAO"

    echo
    pm2 status || true

    echo
    docker ps \
        --format \
        'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
}


self_test_cleanup() {

    if [ -n "${TEST_CONTAINER:-}" ]; then

        docker rm -f \
            "$TEST_CONTAINER" \
            >/dev/null 2>&1 \
            || true
    fi
}


self_test() {

    banner \
        "GEOFIBER SELF-TEST v${VERSION}"

    check_repository

    for cmd in \
        docker \
        node \
        pnpm \
        openssl
    do

        if ! command_exists "$cmd"; then
            die \
                "Self-test requer: $cmd"
        fi
    done

    docker info \
        >/dev/null 2>&1 \
        || die \
            "Docker daemon indisponivel."

    cd "$APP_DIR"

    info \
        "Removendo runtime anterior da RELEASE."

    rm -rf \
        "$APP_DIR/node_modules" \
        "$APP_DIR/apps/api/node_modules" \
        "$APP_DIR/apps/portal/node_modules" \
        "$APP_DIR/apps/web/node_modules" \
        "$APP_DIR/apps/api/dist" \
        "$APP_DIR/apps/portal/.next" \
        "$APP_DIR/apps/web/dist" \
        "$APP_DIR/.turbo"

    info \
        "Instalacao realmente limpa."

    pnpm install \
        --frozen-lockfile

    pnpm rebuild \
        @prisma/engines \
        @prisma/client \
        prisma

    pnpm \
        --dir apps/api \
        exec prisma generate \
        --schema prisma/schema.prisma

    TEST_CONTAINER="geofiber-installer-selftest-$(date +%s)"

    local test_user="geofiber_test"
    local test_db="geofiber_test"

    local test_password="$(
        openssl rand -hex 24
    )"

    trap self_test_cleanup EXIT

    info \
        "Subindo container PostGIS descartavel."

    docker pull \
        "$POSTGIS_IMAGE" \
        >/dev/null

    docker run \
        -d \
        --name "$TEST_CONTAINER" \
        -e "POSTGRES_USER=$test_user" \
        -e "POSTGRES_PASSWORD=$test_password" \
        -e "POSTGRES_DB=$test_db" \
        -p 127.0.0.1::5432 \
        "$POSTGIS_IMAGE" \
        >/dev/null

    local ready=0

    for n in $(seq 1 60)
    do

        if docker exec \
            "$TEST_CONTAINER" \
            pg_isready \
            -U "$test_user" \
            -d "$test_db" \
            >/dev/null 2>&1
        then

            ready=1
            break
        fi

        sleep 1
    done

    if [ "$ready" -ne 1 ]; then

        docker logs \
            "$TEST_CONTAINER" \
            --tail 200 \
            || true

        die \
            "PostgreSQL de teste nao ficou pronto."
    fi

    local test_port=""

    test_port="$(
        docker port \
            "$TEST_CONTAINER" \
            5432/tcp |
        head -n1 |
        sed -E \
            's/.*:([0-9]+)$/\1/'
    )"

    if ! [[ "$test_port" =~ ^[0-9]+$ ]]; then
        die \
            "Porta do PostgreSQL de teste invalida."
    fi

    local test_url="postgresql://${test_user}:${test_password}@127.0.0.1:${test_port}/${test_db}?schema=public"

    echo "TEST_DATABASE=geofiber_test"
    echo "TEST_DATABASE_CONTAINER=$TEST_CONTAINER"
    echo "TEST_DATABASE_HOST=127.0.0.1"
    echo "TEST_DATABASE_PORT=$test_port"
    echo "TEST_PASSWORD_PRINTED=NAO"

    info \
        "Prisma validate."

    DATABASE_URL="$test_url" \
    pnpm \
        --dir apps/api \
        exec prisma validate \
        --schema prisma/schema.prisma

    info \
        "Aplicando baseline em banco TOTALMENTE VAZIO."

    DATABASE_URL="$test_url" \
    pnpm \
        --dir apps/api \
        exec prisma migrate deploy \
        --schema prisma/schema.prisma

    DATABASE_URL="$test_url" \
    pnpm \
        --dir apps/api \
        exec prisma migrate status \
        --schema prisma/schema.prisma

    local source_count=""

    source_count="$(
        find \
            apps/api/prisma/migrations \
            -type f \
            -name migration.sql |
        wc -l |
        tr -d '[:space:]'
    )"

    local database_count=""

    database_count="$(
        docker exec \
            "$TEST_CONTAINER" \
            psql \
            -U "$test_user" \
            -d "$test_db" \
            -Atc \
            'SELECT count(*) FROM "_prisma_migrations" WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL;' |
        tr -d '[:space:]'
    )"

    local failed_count=""

    failed_count="$(
        docker exec \
            "$TEST_CONTAINER" \
            psql \
            -U "$test_user" \
            -d "$test_db" \
            -Atc \
            'SELECT count(*) FROM "_prisma_migrations" WHERE finished_at IS NULL AND rolled_back_at IS NULL;' |
        tr -d '[:space:]'
    )"

    echo "SOURCE_MIGRATIONS=$source_count"
    echo "DATABASE_MIGRATIONS=$database_count"
    echo "FAILED_MIGRATIONS=$failed_count"

    if [ "$source_count" != "1" ]; then
        die \
            "Release deve possuir somente 1 baseline."
    fi

    if [ "$database_count" != "1" ]; then
        die \
            "Banco deveria possuir 1 migration aplicada."
    fi

    if [ "$failed_count" != "0" ]; then
        die \
            "Migration falhou."
    fi

    local postgis_version=""

    postgis_version="$(
        docker exec \
            "$TEST_CONTAINER" \
            psql \
            -U "$test_user" \
            -d "$test_db" \
            -Atc \
            'SELECT PostGIS_Version();' |
        head -n1
    )"

    if [ -z "$postgis_version" ]; then
        die \
            "PostGIS nao foi criado pela baseline."
    fi

    echo "POSTGIS_VERSION=$postgis_version"

    for table in \
        Company \
        User \
        Role \
        Permission
    do

        local exists=""

        exists="$(
            docker exec \
                "$TEST_CONTAINER" \
                psql \
                -U "$test_user" \
                -d "$test_db" \
                -Atc \
                "SELECT to_regclass('public.\"${table}\"') IS NOT NULL;" |
            tr -d '[:space:]'
        )"

        echo "TABLE_EXISTS=$exists TABLE=$table"

        if [ "$exists" != "t" ]; then
            die \
                "Tabela obrigatoria ausente: $table"
        fi
    done

    info \
        "Build API."

    pnpm \
        --dir apps/api \
        build

    info \
        "Build Portal."

    NEXT_PUBLIC_API_URL="http://127.0.0.1:3001" \
    pnpm \
        --dir apps/portal \
        build

    self_test_cleanup

    trap - EXIT

    echo
    echo "============================================================"
    echo "SELF_TEST_STATUS=OK"
    echo "TEST_DATABASE=geofiber_test"
    echo "TEST_DATABASE_ISOLATED=SIM"
    echo "POSTGIS=OK"
    echo "PRISMA_GENERATE=OK"
    echo "PRISMA_VALIDATE=OK"
    echo "MIGRATE_DEPLOY=OK"
    echo "MIGRATE_STATUS=OK"
    echo "MIGRATION_COUNT=1/1"
    echo "FAILED_MIGRATIONS=0"
    echo "API_BUILD=OK"
    echo "PORTAL_BUILD=OK"
    echo "TEST_DATABASE_REMOVED=SIM"
    echo "============================================================"
}


check_mode() {

    banner \
        "GEOFIBER CHECK"

    check_repository

    bash -n \
        "$APP_DIR/install_geofiber.sh"

    echo "INSTALLER_VERSION=$VERSION"
    echo "BASH_SYNTAX=OK"
    echo "MIGRATION_BASELINE=000000000000_clean_baseline"
    echo "MIGRATION_COUNT=1"
    echo "CHECK_STATUS=OK"
}


install_mode() {

    require_root

    setup_log

    banner \
        "GEOFIBER INSTALLER v${VERSION}"

    check_repository
    install_system_packages
    install_node
    prepare_environment
    prepare_database
    prepare_redis
    install_dependencies
    run_prisma
    build_application
    configure_pm2
    configure_nginx
    configure_ssl
    health_checks
    show_result
}


case "$MODE" in

    install|"")
        install_mode
        ;;

    --check|check)
        check_mode
        ;;

    --self-test|self-test)
        self_test
        ;;

    --version)
        echo "$VERSION"
        ;;

    --help|-h)

        cat <<'EOF'
GeoFiber Maps Installer

Instalacao completa em VPS nova:

  ./install_geofiber.sh

Validacao estrutural:

  ./install_geofiber.sh --check

Self-test:
cria SOMENTE um banco geofiber_test
dentro de container PostGIS descartavel.

  ./install_geofiber.sh --self-test

Variaveis opcionais:

  GEOFIBER_DOMAIN
  GEOFIBER_PANEL_DOMAIN
  GEOFIBER_API_DOMAIN
  GEOFIBER_API_PUBLIC_URL

  GEOFIBER_ENABLE_SSL=1
  GEOFIBER_SSL_EMAIL=admin@example.com

  GEOFIBER_NODE_MAJOR=22
  GEOFIBER_PNPM_VERSION=10.0.0
EOF
        ;;

    *)
        die \
            "Modo desconhecido: $MODE"
        ;;
esac
