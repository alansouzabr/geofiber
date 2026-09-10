#!/usr/bin/env bash
set -euo pipefail
NAME="$1"
BASE="src/modules/$NAME"
mkdir -p "$BASE"

cat > "$BASE/$NAME.module.ts" <<TS
import { Module } from '@nestjs/common';
import { ${NAME^}Controller } from './$NAME.controller';
import { ${NAME^}Service } from './$NAME.service';

@Module({
  controllers: [${NAME^}Controller],
  providers: [${NAME^}Service],
  exports: [${NAME^}Service],
})
export class ${NAME^}Module {}
TS

cat > "$BASE/$NAME.controller.ts" <<TS
import { Controller } from '@nestjs/common';

@Controller('$NAME')
export class ${NAME^}Controller {}
TS

cat > "$BASE/$NAME.service.ts" <<TS
import { Injectable } from '@nestjs/common';

@Injectable()
export class ${NAME^}Service {}
TS

cat > "$BASE/dto.ts" <<TS
export class Create${NAME^}Dto {}
export class Update${NAME^}Dto {}
TS

echo "✅ Module created at $BASE"
