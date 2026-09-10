"use client";

/*
 * ETAPA32H_CARRO
 *
 * Veículo operacional por técnico.
 *
 * Persistência:
 *
 * FieldTechnicianProfile.vehicle Json?
 *
 * Existe apenas uma rota canônica:
 *
 * /execucao/carro
 */

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
  ReactNode,
} from "react";


type PlatformCompany = {
  id: string;
  name: string;
  isActive?: boolean;
};


type TechnicianUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
};


type VehicleStatus =
  | "EM_USO"
  | "DISPONIVEL"
  | "MANUTENCAO"
  | "INATIVO";


type TechnicianVehicle = {
  type: string;
  brand: string;
  model: string;
  year?: string;
  plate: string;
  color?: string;
  assetTag?: string;
  mileageKm?: number;
  status: VehicleStatus;
  notes?: string;
  updatedAt?: string;
};


type Technician = {
  id: string;
  companyId?: string;
  userId: string;
  isActive?: boolean;
  vehicle?: unknown;
  User?: TechnicianUser | null;
};


const VEHICLE_TYPES = [
  "Carro",
  "Moto",
  "Utilitário",
  "Caminhonete",
  "Van",
  "Outro",
];


const STATUS_OPTIONS:
Array<{
  value: VehicleStatus;
  label: string;
}> = [
  {
    value: "EM_USO",
    label: "Em uso",
  },
  {
    value: "DISPONIVEL",
    label: "Disponível",
  },
  {
    value: "MANUTENCAO",
    label: "Manutenção",
  },
  {
    value: "INATIVO",
    label: "Inativo",
  },
];


const inputClass = `
  mt-2
  w-full
  rounded-xl
  border
  border-slate-700
  bg-slate-950
  px-4
  py-3
  text-sm
  text-white
  outline-none
  transition
  focus:border-cyan-500
`;


function getApiUrl() {

  const value =
    process.env
      .NEXT_PUBLIC_API_URL;


  if (!value) {

    throw new Error(
      "NEXT_PUBLIC_API_URL não configurada."
    );

  }


  return value;

}


async function authorizedFetch(
  endpoint: string,
  options: RequestInit = {}
) {

  const token =
    localStorage.getItem(
      "token"
    );


  if (!token) {

    throw new Error(
      "Sessão não encontrada."
    );

  }


  const response =
    await fetch(
      `${getApiUrl()}${endpoint}`,
      {
        ...options,

        cache:
          "no-store",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,

          ...(options.headers || {}),
        },
      }
    );


  const raw =
    await response.text();


  let data: unknown =
    null;


  try {

    data =
      raw
        ? JSON.parse(raw)
        : null;

  } catch {

    data = raw;

  }


  if (!response.ok) {

    let message = "";


    if (
      data &&
      typeof data === "object" &&
      "message" in data
    ) {

      const value =
        (
          data as {
            message?: unknown;
          }
        ).message;


      if (Array.isArray(value)) {

        message =
          value
            .map(String)
            .join(", ");

      } else if (
        value !== undefined &&
        value !== null
      ) {

        message =
          String(value);

      }

    }


    throw new Error(
      message ||
      `API_${response.status}`
    );

  }


  return data;

}


function isVehicleStatus(
  value: unknown
): value is VehicleStatus {

  return (
    value === "EM_USO" ||
    value === "DISPONIVEL" ||
    value === "MANUTENCAO" ||
    value === "INATIVO"
  );

}


function normalizeVehicle(
  value: unknown
): TechnicianVehicle | null {

  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {

    return null;

  }


  const raw =
    value as
      Record<string, unknown>;


  const type =
    typeof raw.type === "string"
      ? raw.type.trim()
      : "";


  const brand =
    typeof raw.brand === "string"
      ? raw.brand.trim()
      : "";


  const model =
    typeof raw.model === "string"
      ? raw.model.trim()
      : "";


  const plate =
    typeof raw.plate === "string"
      ? raw.plate.trim()
      : "";


  const assetTag =
    typeof raw.assetTag === "string"
      ? raw.assetTag.trim()
      : "";


  if (
    !type &&
    !brand &&
    !model &&
    !plate &&
    !assetTag
  ) {

    return null;

  }


  return {
    type:
      type ||
      "Carro",

    brand,

    model,

    year:
      typeof raw.year === "string"
        ? raw.year
        : "",

    plate,

    color:
      typeof raw.color === "string"
        ? raw.color
        : "",

    assetTag,

    mileageKm:
      typeof raw.mileageKm === "number" &&
      Number.isFinite(raw.mileageKm)
        ? raw.mileageKm
        : undefined,

    status:
      isVehicleStatus(
        raw.status
      )
        ? raw.status
        : "EM_USO",

    notes:
      typeof raw.notes === "string"
        ? raw.notes
        : "",

    updatedAt:
      typeof raw.updatedAt === "string"
        ? raw.updatedAt
        : undefined,
  };

}


function statusLabel(
  status: VehicleStatus
) {

  return (
    STATUS_OPTIONS.find(
      item =>
        item.value === status
    )?.label ||
    status
  );

}


export default function CarroPage() {

  const [
    companies,
    setCompanies,
  ] =
    useState<PlatformCompany[]>(
      []
    );


  const [
    selectedCompanyId,
    setSelectedCompanyId,
  ] =
    useState("");


  const [
    technicians,
    setTechnicians,
  ] =
    useState<Technician[]>(
      []
    );


  const [
    selectedTechnicianId,
    setSelectedTechnicianId,
  ] =
    useState("");


  const [
    loadingCompanies,
    setLoadingCompanies,
  ] =
    useState(true);


  const [
    loadingTechnicians,
    setLoadingTechnicians,
  ] =
    useState(false);


  const [
    saving,
    setSaving,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    success,
    setSuccess,
  ] =
    useState("");


  const [
    type,
    setType,
  ] =
    useState(
      VEHICLE_TYPES[0]
    );


  const [
    brand,
    setBrand,
  ] =
    useState("");


  const [
    model,
    setModel,
  ] =
    useState("");


  const [
    year,
    setYear,
  ] =
    useState("");


  const [
    plate,
    setPlate,
  ] =
    useState("");


  const [
    color,
    setColor,
  ] =
    useState("");


  const [
    assetTag,
    setAssetTag,
  ] =
    useState("");


  const [
    mileageKm,
    setMileageKm,
  ] =
    useState("");


  const [
    status,
    setStatus,
  ] =
    useState<VehicleStatus>(
      "EM_USO"
    );


  const [
    notes,
    setNotes,
  ] =
    useState("");


  const selectedCompany =
    useMemo(
      () =>
        companies.find(
          company =>
            company.id ===
            selectedCompanyId
        ) || null,
      [
        companies,
        selectedCompanyId,
      ]
    );


  const selectedTechnician =
    useMemo(
      () =>
        technicians.find(
          technician =>
            technician.id ===
            selectedTechnicianId
        ) || null,
      [
        technicians,
        selectedTechnicianId,
      ]
    );


  const selectedVehicle =
    useMemo(
      () =>
        normalizeVehicle(
          selectedTechnician?.vehicle
        ),
      [
        selectedTechnician,
      ]
    );


  const vehicleCount =
    useMemo(
      () =>
        technicians.filter(
          technician =>
            Boolean(
              normalizeVehicle(
                technician.vehicle
              )
            )
        ).length,
      [
        technicians,
      ]
    );


  const maintenanceCount =
    useMemo(
      () =>
        technicians.filter(
          technician =>
            normalizeVehicle(
              technician.vehicle
            )?.status ===
              "MANUTENCAO"
        ).length,
      [
        technicians,
      ]
    );


  async function loadCompanies() {

    try {

      setLoadingCompanies(
        true
      );

      setError("");


      const data =
        await authorizedFetch(
          "/admin/companies"
        );


      const list =
        Array.isArray(data)
          ? (
              data as
                PlatformCompany[]
            )
          : [];


      setCompanies(
        list
      );


      setSelectedCompanyId(
        current => {

          if (
            current &&
            list.some(
              company =>
                company.id ===
                current
            )
          ) {

            return current;

          }


          const active =
            list.find(
              company =>
                company.isActive !==
                false
            );


          return (
            active?.id ||
            list[0]?.id ||
            ""
          );

        }
      );

    } catch (err) {

      console.error(
        "CAR COMPANIES ERROR:",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as empresas."
      );

    } finally {

      setLoadingCompanies(
        false
      );

    }

  }


  async function loadTechnicians(
    companyId: string
  ) {

    if (!companyId) {

      setTechnicians(
        []
      );

      setSelectedTechnicianId(
        ""
      );

      return;

    }


    try {

      setLoadingTechnicians(
        true
      );

      setError("");


      const data =
        await authorizedFetch(
          `/field-technicians/platform/company/${encodeURIComponent(
            companyId
          )}`
        );


      const list =
        Array.isArray(data)
          ? (
              data as
                Technician[]
            )
          : [];


      setTechnicians(
        list
      );


      setSelectedTechnicianId(
        current => {

          if (
            current &&
            list.some(
              technician =>
                technician.id ===
                current
            )
          ) {

            return current;

          }


          return (
            list[0]?.id ||
            ""
          );

        }
      );

    } catch (err) {

      console.error(
        "CAR TECHNICIANS ERROR:",
        err
      );


      setTechnicians(
        []
      );

      setSelectedTechnicianId(
        ""
      );


      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os técnicos."
      );

    } finally {

      setLoadingTechnicians(
        false
      );

    }

  }


  useEffect(
    () => {

      void loadCompanies();

    },
    []
  );


  useEffect(
    () => {

      setSuccess("");
      setError("");
      setSelectedTechnicianId("");

      if (!selectedCompanyId) {

        setTechnicians([]);

        return;

      }


      void loadTechnicians(
        selectedCompanyId
      );

    },
    [
      selectedCompanyId,
    ]
  );


  useEffect(
    () => {

      const vehicle =
        selectedVehicle;


      if (!vehicle) {

        setType(
          VEHICLE_TYPES[0]
        );

        setBrand("");
        setModel("");
        setYear("");
        setPlate("");
        setColor("");
        setAssetTag("");
        setMileageKm("");

        setStatus(
          "EM_USO"
        );

        setNotes("");

        return;

      }


      setType(
        vehicle.type ||
        VEHICLE_TYPES[0]
      );

      setBrand(
        vehicle.brand ||
        ""
      );

      setModel(
        vehicle.model ||
        ""
      );

      setYear(
        vehicle.year ||
        ""
      );

      setPlate(
        vehicle.plate ||
        ""
      );

      setColor(
        vehicle.color ||
        ""
      );

      setAssetTag(
        vehicle.assetTag ||
        ""
      );

      setMileageKm(
        vehicle.mileageKm !==
        undefined
          ? String(
              vehicle.mileageKm
            )
          : ""
      );

      setStatus(
        vehicle.status
      );

      setNotes(
        vehicle.notes ||
        ""
      );

    },
    [
      selectedVehicle,
    ]
  );


  async function persistVehicle(
    vehicle: Record<string, unknown>,
    message: string
  ) {

    if (
      !selectedCompanyId ||
      !selectedTechnician
    ) {

      setError(
        "Selecione empresa e técnico."
      );

      return false;

    }


    try {

      setSaving(
        true
      );

      setError("");
      setSuccess("");


      const data =
        await authorizedFetch(
          `/field-technicians/platform/company/${encodeURIComponent(
            selectedCompanyId
          )}/${encodeURIComponent(
            selectedTechnician.id
          )}/vehicle`,
          {
            method:
              "PATCH",

            body:
              JSON.stringify({
                vehicle,
              }),
          }
        );


      if (
        data &&
        typeof data === "object"
      ) {

        const updated =
          data as Technician;


        setTechnicians(
          current =>
            current.map(
              technician =>
                technician.id ===
                selectedTechnician.id
                  ? updated
                  : technician
            )
        );

      } else {

        await loadTechnicians(
          selectedCompanyId
        );

      }


      setSuccess(
        message
      );


      return true;

    } catch (err) {

      console.error(
        "CAR SAVE ERROR:",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar o veículo."
      );


      return false;

    } finally {

      setSaving(
        false
      );

    }

  }


  async function saveVehicle(
    event: FormEvent
  ) {

    event.preventDefault();


    if (!selectedTechnician) {

      setError(
        "Selecione um técnico."
      );

      return;

    }


    const cleanPlate =
      plate
        .trim()
        .toUpperCase();


    if (!cleanPlate) {

      setError(
        "Informe a placa."
      );

      return;

    }


    let parsedMileage:
      number | undefined =
        undefined;


    if (
      mileageKm.trim()
    ) {

      parsedMileage =
        Number(
          mileageKm
            .trim()
            .replace(",", ".")
        );


      if (
        !Number.isFinite(
          parsedMileage
        ) ||
        parsedMileage < 0
      ) {

        setError(
          "Quilometragem inválida."
        );

        return;

      }

    }


    await persistVehicle(
      {
        type:
          type.trim() ||
          "Carro",

        brand:
          brand.trim(),

        model:
          model.trim(),

        year:
          year.trim(),

        plate:
          cleanPlate,

        color:
          color.trim(),

        assetTag:
          assetTag.trim(),

        mileageKm:
          parsedMileage,

        status,

        notes:
          notes.trim(),

        updatedAt:
          new Date()
            .toISOString(),
      },
      selectedVehicle
        ? "Veículo atualizado."
        : "Veículo atribuído."
    );

  }


  async function removeVehicle() {

    if (!selectedVehicle) {

      return;

    }


    if (
      !window.confirm(
        "Remover o veículo atribuído a este técnico?"
      )
    ) {

      return;

    }


    await persistVehicle(
      {},
      "Veículo removido."
    );

  }


  return (

    <main
      className="
        space-y-6
      "
    >

      <section
        className="
          rounded-3xl
          border
          border-slate-800
          bg-[#081223]
          p-5
          lg:p-8
        "
      >

        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          <div>

            <div
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.18em]
                text-cyan-400
              "
            >
              Execução
            </div>


            <h1
              className="
                mt-2
                text-3xl
                font-black
                text-white
              "
            >
              Carro
            </h1>


            <p
              className="
                mt-2
                max-w-3xl
                text-sm
                leading-6
                text-slate-400
              "
            >
              Controle o veículo operacional
              atribuído a cada técnico de campo.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              void loadCompanies()
            }
            disabled={
              loadingCompanies
            }
            className="
              rounded-xl
              border
              border-slate-700
              px-4
              py-2.5
              text-sm
              font-bold
              text-slate-200
              transition
              hover:border-cyan-500
              hover:text-cyan-300
              disabled:opacity-50
            "
          >
            {
              loadingCompanies
                ? "Atualizando..."
                : "Atualizar"
            }
          </button>

        </div>

      </section>


      <section
        className="
          rounded-3xl
          border
          border-slate-800
          bg-[#081223]
          p-5
          lg:p-8
        "
      >

        <div
          className="
            grid
            gap-4
            xl:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(170px,1fr))]
          "
        >

          <div>

            <div
              className="
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-slate-500
              "
            >
              Empresa
            </div>


            <select
              value={
                selectedCompanyId
              }
              onChange={
                event =>
                  setSelectedCompanyId(
                    event.target.value
                  )
              }
              disabled={
                loadingCompanies ||
                companies.length === 0
              }
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-950
                px-4
                py-3
                text-sm
                font-bold
                text-white
                outline-none
                focus:border-cyan-500
                disabled:opacity-50
              "
            >

              {
                companies.length === 0
                  ? (
                    <option value="">
                      Nenhuma empresa
                    </option>
                  )
                  : companies.map(
                      company => (
                        <option
                          key={
                            company.id
                          }
                          value={
                            company.id
                          }
                        >
                          {company.name}
                          {
                            company.isActive ===
                            false
                              ? " — INATIVA"
                              : ""
                          }
                        </option>
                      )
                    )
              }

            </select>


            <div
              className="
                mt-2
                text-xs
                text-slate-600
              "
            >
              {
                selectedCompany
                  ?.name ||
                "Empresa não selecionada"
              }
            </div>

          </div>


          <StatCard
            label="Técnicos"
            value={
              technicians.length
            }
          />


          <StatCard
            label="Com veículo"
            value={
              vehicleCount
            }
          />


          <StatCard
            label="Manutenção"
            value={
              maintenanceCount
            }
          />

        </div>

      </section>


      {
        error
          ? (
            <div
              className="
                rounded-2xl
                border
                border-red-900/50
                bg-red-950/30
                p-4
                text-sm
                text-red-300
              "
            >
              {error}
            </div>
          )
          : null
      }


      {
        success
          ? (
            <div
              className="
                rounded-2xl
                border
                border-emerald-900/50
                bg-emerald-950/30
                p-4
                text-sm
                text-emerald-300
              "
            >
              {success}
            </div>
          )
          : null
      }


      <section
        className="
          grid
          gap-6
          xl:grid-cols-[340px_minmax(0,1fr)]
        "
      >

        <aside
          className="
            rounded-3xl
            border
            border-slate-800
            bg-[#081223]
            p-5
          "
        >

          <h2
            className="
              text-lg
              font-black
              text-white
            "
          >
            Técnicos
          </h2>


          <p
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            Selecione o técnico para
            consultar ou atribuir veículo.
          </p>


          {
            loadingTechnicians
              ? (
                <div
                  className="
                    py-8
                    text-center
                    text-sm
                    text-cyan-400
                  "
                >
                  Carregando...
                </div>
              )
              : technicians.length ===
                0
                ? (
                  <div
                    className="
                      mt-5
                      rounded-2xl
                      border
                      border-dashed
                      border-slate-700
                      p-6
                      text-center
                      text-sm
                      text-slate-500
                    "
                  >
                    Nenhum técnico cadastrado.
                  </div>
                )
                : (
                  <div
                    className="
                      mt-5
                      space-y-2
                    "
                  >

                    {
                      technicians.map(
                        technician => {

                          const vehicle =
                            normalizeVehicle(
                              technician.vehicle
                            );


                          const active =
                            technician.id ===
                            selectedTechnicianId;


                          return (

                            <button
                              key={
                                technician.id
                              }
                              type="button"
                              onClick={() => {

                                setSelectedTechnicianId(
                                  technician.id
                                );

                                setError("");
                                setSuccess("");

                              }}
                              className={`
                                w-full
                                rounded-2xl
                                border
                                p-4
                                text-left
                                transition
                                ${
                                  active
                                    ? "border-cyan-500 bg-cyan-500/10"
                                    : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                                }
                              `}
                            >

                              <div
                                className="
                                  truncate
                                  font-black
                                  text-white
                                "
                              >
                                {
                                  technician
                                    .User
                                    ?.name ||
                                  "Técnico"
                                }
                              </div>


                              <div
                                className="
                                  mt-1
                                  truncate
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {
                                  technician
                                    .User
                                    ?.email ||
                                  "Sem e-mail"
                                }
                              </div>


                              <div
                                className={`
                                  mt-3
                                  text-xs
                                  font-bold
                                  ${
                                    vehicle
                                      ? "text-cyan-400"
                                      : "text-slate-600"
                                  }
                                `}
                              >
                                {
                                  vehicle
                                    ? `${vehicle.plate || "Sem placa"} · ${vehicle.model || vehicle.type}`
                                    : "Sem veículo"
                                }
                              </div>

                            </button>

                          );

                        }
                      )
                    }

                  </div>
                )
          }

        </aside>


        <div
          className="
            space-y-6
          "
        >

          <section
            className="
              rounded-3xl
              border
              border-slate-800
              bg-[#081223]
              p-5
              lg:p-7
            "
          >

            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div>

                <div
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Técnico selecionado
                </div>


                <h2
                  className="
                    mt-1
                    text-xl
                    font-black
                    text-white
                  "
                >
                  {
                    selectedTechnician
                      ?.User
                      ?.name ||
                    "Nenhum técnico selecionado"
                  }
                </h2>

              </div>


              {
                selectedVehicle
                  ? (
                    <span
                      className="
                        rounded-full
                        bg-cyan-500/10
                        px-3
                        py-1.5
                        text-xs
                        font-black
                        text-cyan-300
                      "
                    >
                      {
                        statusLabel(
                          selectedVehicle.status
                        )
                      }
                    </span>
                  )
                  : null
              }

            </div>

          </section>


          {
            selectedTechnician
              ? (
                <section
                  className="
                    rounded-3xl
                    border
                    border-slate-800
                    bg-[#081223]
                    p-5
                    lg:p-7
                  "
                >

                  <div
                    className="
                      flex
                      flex-col
                      gap-3
                      sm:flex-row
                      sm:items-start
                      sm:justify-between
                    "
                  >

                    <div>

                      <h2
                        className="
                          text-xl
                          font-black
                          text-white
                        "
                      >
                        {
                          selectedVehicle
                            ? "Veículo Atual"
                            : "Atribuir Veículo"
                        }
                      </h2>


                      <p
                        className="
                          mt-1
                          text-sm
                          text-slate-500
                        "
                      >
                        Um veículo operacional
                        por perfil técnico.
                      </p>

                    </div>


                    {
                      selectedVehicle
                        ? (
                          <button
                            type="button"
                            onClick={() =>
                              void removeVehicle()
                            }
                            disabled={
                              saving
                            }
                            className="
                              rounded-xl
                              border
                              border-red-900/50
                              px-4
                              py-2.5
                              text-xs
                              font-black
                              text-red-300
                              transition
                              hover:bg-red-950/30
                              disabled:opacity-50
                            "
                          >
                            Remover Veículo
                          </button>
                        )
                        : null
                    }

                  </div>


                  <form
                    onSubmit={
                      saveVehicle
                    }
                    className="
                      mt-6
                      grid
                      gap-4
                      lg:grid-cols-2
                    "
                  >

                    <Field
                      label="Tipo"
                    >
                      <select
                        value={
                          type
                        }
                        onChange={
                          event =>
                            setType(
                              event.target.value
                            )
                        }
                        className={
                          inputClass
                        }
                      >
                        {
                          VEHICLE_TYPES.map(
                            item => (
                              <option
                                key={
                                  item
                                }
                                value={
                                  item
                                }
                              >
                                {item}
                              </option>
                            )
                          )
                        }
                      </select>
                    </Field>


                    <Field
                      label="Placa *"
                    >
                      <input
                        value={
                          plate
                        }
                        onChange={
                          event =>
                            setPlate(
                              event.target.value
                            )
                        }
                        placeholder="ABC1D23"
                        maxLength={10}
                        className={
                          inputClass
                        }
                      />
                    </Field>


                    <Field
                      label="Marca"
                    >
                      <input
                        value={
                          brand
                        }
                        onChange={
                          event =>
                            setBrand(
                              event.target.value
                            )
                        }
                        placeholder="Ex.: Fiat"
                        className={
                          inputClass
                        }
                      />
                    </Field>


                    <Field
                      label="Modelo"
                    >
                      <input
                        value={
                          model
                        }
                        onChange={
                          event =>
                            setModel(
                              event.target.value
                            )
                        }
                        placeholder="Ex.: Strada"
                        className={
                          inputClass
                        }
                      />
                    </Field>


                    <Field
                      label="Ano"
                    >
                      <input
                        value={
                          year
                        }
                        onChange={
                          event =>
                            setYear(
                              event.target.value
                            )
                        }
                        placeholder="2026"
                        inputMode="numeric"
                        className={
                          inputClass
                        }
                      />
                    </Field>


                    <Field
                      label="Cor"
                    >
                      <input
                        value={
                          color
                        }
                        onChange={
                          event =>
                            setColor(
                              event.target.value
                            )
                        }
                        placeholder="Branco"
                        className={
                          inputClass
                        }
                      />
                    </Field>


                    <Field
                      label="Patrimônio"
                    >
                      <input
                        value={
                          assetTag
                        }
                        onChange={
                          event =>
                            setAssetTag(
                              event.target.value
                            )
                        }
                        placeholder="GF-CAR-001"
                        className={
                          inputClass
                        }
                      />
                    </Field>


                    <Field
                      label="Quilometragem"
                    >
                      <input
                        value={
                          mileageKm
                        }
                        onChange={
                          event =>
                            setMileageKm(
                              event.target.value
                            )
                        }
                        placeholder="Ex.: 45280"
                        inputMode="decimal"
                        className={
                          inputClass
                        }
                      />
                    </Field>


                    <Field
                      label="Situação"
                    >
                      <select
                        value={
                          status
                        }
                        onChange={
                          event =>
                            setStatus(
                              event.target.value as VehicleStatus
                            )
                        }
                        className={
                          inputClass
                        }
                      >
                        {
                          STATUS_OPTIONS.map(
                            item => (
                              <option
                                key={
                                  item.value
                                }
                                value={
                                  item.value
                                }
                              >
                                {item.label}
                              </option>
                            )
                          )
                        }
                      </select>
                    </Field>


                    <div
                      className="
                        lg:col-span-2
                      "
                    >

                      <Field
                        label="Observações"
                      >
                        <textarea
                          value={
                            notes
                          }
                          onChange={
                            event =>
                              setNotes(
                                event.target.value
                              )
                          }
                          rows={4}
                          className={
                            inputClass
                          }
                        />
                      </Field>

                    </div>


                    <div
                      className="
                        flex
                        justify-end
                        lg:col-span-2
                      "
                    >

                      <button
                        type="submit"
                        disabled={
                          saving
                        }
                        className="
                          rounded-xl
                          bg-cyan-500
                          px-5
                          py-3
                          text-sm
                          font-black
                          text-slate-950
                          transition
                          hover:bg-cyan-400
                          disabled:opacity-50
                        "
                      >
                        {
                          saving
                            ? "Salvando..."
                            : selectedVehicle
                              ? "Atualizar Veículo"
                              : "Atribuir Veículo"
                        }
                      </button>

                    </div>

                  </form>


                  {
                    selectedVehicle
                      ? (
                        <div
                          className="
                            mt-6
                            grid
                            gap-3
                            rounded-2xl
                            border
                            border-slate-800
                            bg-slate-950/40
                            p-5
                            text-sm
                            sm:grid-cols-2
                            xl:grid-cols-3
                          "
                        >

                          <Value
                            label="Placa"
                            value={
                              selectedVehicle.plate
                            }
                          />

                          <Value
                            label="Tipo"
                            value={
                              selectedVehicle.type
                            }
                          />

                          <Value
                            label="Marca"
                            value={
                              selectedVehicle.brand
                            }
                          />

                          <Value
                            label="Modelo"
                            value={
                              selectedVehicle.model
                            }
                          />

                          <Value
                            label="Ano"
                            value={
                              selectedVehicle.year
                            }
                          />

                          <Value
                            label="Cor"
                            value={
                              selectedVehicle.color
                            }
                          />

                          <Value
                            label="Patrimônio"
                            value={
                              selectedVehicle.assetTag
                            }
                          />

                          <Value
                            label="KM"
                            value={
                              selectedVehicle.mileageKm !==
                              undefined
                                ? String(
                                    selectedVehicle.mileageKm
                                  )
                                : ""
                            }
                          />

                          <Value
                            label="Situação"
                            value={
                              statusLabel(
                                selectedVehicle.status
                              )
                            }
                          />

                        </div>
                      )
                      : null
                  }

                </section>
              )
              : (
                <section
                  className="
                    rounded-3xl
                    border
                    border-dashed
                    border-slate-700
                    bg-[#081223]
                    p-10
                    text-center
                  "
                >

                  <div
                    className="
                      text-lg
                      font-black
                      text-white
                    "
                  >
                    Selecione um técnico
                  </div>


                  <div
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >
                    O veículo será vinculado
                    ao perfil técnico escolhido.
                  </div>

                </section>
              )
          }

        </div>

      </section>

    </main>

  );

}


function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {

  return (

    <label
      className="
        block
      "
    >

      <span
        className="
          text-xs
          font-bold
          uppercase
          tracking-wide
          text-slate-500
        "
      >
        {label}
      </span>

      {children}

    </label>

  );

}


function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-slate-800
        bg-slate-950/50
        p-4
      "
    >

      <div
        className="
          text-xs
          font-bold
          uppercase
          tracking-wide
          text-slate-500
        "
      >
        {label}
      </div>


      <div
        className="
          mt-2
          text-3xl
          font-black
          text-white
        "
      >
        {value}
      </div>

    </div>

  );

}


function Value({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {

  return (

    <div>

      <span
        className="
          text-slate-600
        "
      >
        {label}:
      </span>{" "}

      <span
        className="
          text-slate-300
        "
      >
        {value || "—"}
      </span>

    </div>

  );

}
