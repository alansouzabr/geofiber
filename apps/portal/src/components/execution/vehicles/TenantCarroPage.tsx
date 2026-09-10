"use client";

/*
 * ETAPA35A11C2D_R1B_TENANT_CAR
 *
 * Gestão do veículo dentro da empresa
 * autenticada.
 *
 * Não recebe companyId na URL da API.
 * A empresa é determinada exclusivamente
 * pelo JWT no backend.
 */

import {
  useEffect,
  useMemo,
  useState,
} from "react";


type VehicleStatus =
  | "EM_USO"
  | "DISPONIVEL"
  | "MANUTENCAO"
  | "INATIVO";


type Vehicle = {
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
};


type Technician = {
  id: string;
  userId: string;
  vehicle?: unknown;

  User?: {
    id?: string;
    name?: string | null;
    email?: string | null;
  } | null;
};


type Props = {
  companyName?: string | null;
};


type FormState = {
  type: string;
  brand: string;
  model: string;
  year: string;
  plate: string;
  color: string;
  assetTag: string;
  mileageKm: string;
  status: VehicleStatus;
  notes: string;
};


const EMPTY_FORM: FormState = {
  type: "Carro",
  brand: "",
  model: "",
  year: "",
  plate: "",
  color: "",
  assetTag: "",
  mileageKm: "",
  status: "EM_USO",
  notes: "",
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


function getApiUrl() {

  const value =
    process.env
      .NEXT_PUBLIC_API_URL;

  if (!value) {
    throw new Error(
      "NEXT_PUBLIC_API_URL não configurada."
    );
  }

  return value.replace(
    /\/+$/,
    ""
  );
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

        cache: "no-store",

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

  let data: any = null;

  try {

    data =
      raw
        ? JSON.parse(raw)
        : null;

  } catch {

    data = raw;

  }

  if (!response.ok) {

    const message =
      Array.isArray(
        data?.message
      )
        ? data.message.join(", ")
        : (
            data?.message ||
            `API_${response.status}`
          );

    throw new Error(
      String(message)
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
): Vehicle | null {

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

  const hasIdentity =
    [
      raw.type,
      raw.brand,
      raw.model,
      raw.plate,
      raw.assetTag,
    ].some(
      item =>
        typeof item === "string" &&
        item.trim() !== ""
    );

  if (!hasIdentity) {
    return null;
  }

  return {
    type:
      typeof raw.type === "string" &&
      raw.type.trim()
        ? raw.type
        : "Carro",

    brand:
      typeof raw.brand === "string"
        ? raw.brand
        : "",

    model:
      typeof raw.model === "string"
        ? raw.model
        : "",

    year:
      typeof raw.year === "string"
        ? raw.year
        : "",

    plate:
      typeof raw.plate === "string"
        ? raw.plate
        : "",

    color:
      typeof raw.color === "string"
        ? raw.color
        : "",

    assetTag:
      typeof raw.assetTag === "string"
        ? raw.assetTag
        : "",

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
  };
}


function vehicleToForm(
  vehicle: Vehicle | null
): FormState {

  if (!vehicle) {
    return {
      ...EMPTY_FORM,
    };
  }

  return {
    type:
      vehicle.type ||
      "Carro",

    brand:
      vehicle.brand ||
      "",

    model:
      vehicle.model ||
      "",

    year:
      vehicle.year ||
      "",

    plate:
      vehicle.plate ||
      "",

    color:
      vehicle.color ||
      "",

    assetTag:
      vehicle.assetTag ||
      "",

    mileageKm:
      vehicle.mileageKm ===
      undefined
        ? ""
        : String(
            vehicle.mileageKm
          ),

    status:
      vehicle.status ||
      "EM_USO",

    notes:
      vehicle.notes ||
      "",
  };
}


const inputClass = `
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
  focus:border-cyan-500
`;


export default function TenantCarroPage({
  companyName
}: Props) {

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
    form,
    setForm,
  ] =
    useState<FormState>({
      ...EMPTY_FORM,
    });

  const [
    loading,
    setLoading,
  ] =
    useState(true);

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


  const selectedTechnician =
    useMemo(
      () =>
        technicians.find(
          item =>
            item.id ===
            selectedTechnicianId
        ) || null,
      [
        technicians,
        selectedTechnicianId,
      ]
    );


  async function loadTechnicians() {

    try {

      setLoading(true);
      setError("");

      const data =
        await authorizedFetch(
          "/field-technicians"
        );

      const list =
        Array.isArray(data)
          ? data as Technician[]
          : [];

      setTechnicians(
        list
      );

      setSelectedTechnicianId(
        current => {

          if (
            current &&
            list.some(
              item =>
                item.id === current
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
        "TENANT CAR LOAD ERROR:",
        err
      );

      setTechnicians([]);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os técnicos."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(
    () => {

      void loadTechnicians();

    },
    []
  );


  useEffect(
    () => {

      const vehicle =
        normalizeVehicle(
          selectedTechnician
            ?.vehicle
        );

      setForm(
        vehicleToForm(
          vehicle
        )
      );

      setSuccess("");
      setError("");

    },
    [
      selectedTechnician,
    ]
  );


  async function saveVehicle() {

    if (!selectedTechnician) {

      setError(
        "Selecione um técnico."
      );

      return;
    }

    const mileage =
      form.mileageKm.trim();

    const vehicle: Vehicle = {
      type:
        form.type.trim() ||
        "Carro",

      brand:
        form.brand.trim(),

      model:
        form.model.trim(),

      year:
        form.year.trim(),

      plate:
        form.plate
          .trim()
          .toUpperCase(),

      color:
        form.color.trim(),

      assetTag:
        form.assetTag.trim(),

      mileageKm:
        mileage === ""
          ? undefined
          : Number(mileage),

      status:
        form.status,

      notes:
        form.notes.trim(),
    };

    if (
      vehicle.mileageKm !==
      undefined &&
      !Number.isFinite(
        vehicle.mileageKm
      )
    ) {

      setError(
        "Quilometragem inválida."
      );

      return;
    }

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      await authorizedFetch(
        `/field-technicians/${
          encodeURIComponent(
            selectedTechnician.id
          )
        }/vehicle`,
        {
          method: "PATCH",

          body:
            JSON.stringify({
              vehicle,
            }),
        }
      );

      await loadTechnicians();

      setSuccess(
        "Veículo atualizado com sucesso."
      );

    } catch (err) {

      console.error(
        "TENANT CAR SAVE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar o veículo."
      );

    } finally {

      setSaving(false);

    }
  }


  return (
    <div className="space-y-6">

      <div>
        <h1
          className="
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
            text-sm
            text-slate-400
          "
        >
          Gestão do veículo operacional
          dos técnicos da empresa
          {companyName
            ? ` ${companyName}`
            : ""}.
        </p>
      </div>


      {error && (
        <div
          className="
            rounded-xl
            border
            border-red-900
            bg-red-950/30
            p-4
            text-sm
            text-red-300
          "
        >
          {error}
        </div>
      )}


      {success && (
        <div
          className="
            rounded-xl
            border
            border-emerald-900
            bg-emerald-950/30
            p-4
            text-sm
            text-emerald-300
          "
        >
          {success}
        </div>
      )}


      <section
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900/40
          p-5
        "
      >

        <label
          className="
            block
            text-sm
            font-semibold
            text-slate-300
          "
        >
          Técnico
        </label>

        <select
          value={
            selectedTechnicianId
          }
          onChange={
            event =>
              setSelectedTechnicianId(
                event.target.value
              )
          }
          disabled={
            loading ||
            technicians.length === 0
          }
          className={`${inputClass} mt-2`}
        >

          {technicians.length === 0 && (
            <option value="">
              Nenhum técnico cadastrado
            </option>
          )}

          {technicians.map(
            technician => (
              <option
                key={
                  technician.id
                }
                value={
                  technician.id
                }
              >
                {
                  technician.User
                    ?.name ||
                  technician.User
                    ?.email ||
                  "Técnico"
                }
              </option>
            )
          )}

        </select>

      </section>


      {selectedTechnician && (

        <section
          className="
            grid
            gap-5
            rounded-2xl
            border
            border-slate-800
            bg-slate-900/40
            p-5
            md:grid-cols-2
          "
        >

          <label className="text-sm text-slate-300">
            Tipo

            <select
              className={`${inputClass} mt-2`}
              value={form.type}
              onChange={
                event =>
                  setForm(
                    current => ({
                      ...current,
                      type:
                        event.target.value,
                    })
                  )
              }
            >
              {VEHICLE_TYPES.map(
                item => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </label>


          <label className="text-sm text-slate-300">
            Status

            <select
              className={`${inputClass} mt-2`}
              value={form.status}
              onChange={
                event =>
                  setForm(
                    current => ({
                      ...current,
                      status:
                        event.target
                          .value as
                          VehicleStatus,
                    })
                  )
              }
            >
              {STATUS_OPTIONS.map(
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
              )}
            </select>
          </label>


          {[
            [
              "Marca",
              "brand",
            ],
            [
              "Modelo",
              "model",
            ],
            [
              "Ano",
              "year",
            ],
            [
              "Placa",
              "plate",
            ],
            [
              "Cor",
              "color",
            ],
            [
              "Patrimônio",
              "assetTag",
            ],
            [
              "Quilometragem",
              "mileageKm",
            ],
          ].map(
            ([label, field]) => (
              <label
                key={field}
                className="
                  text-sm
                  text-slate-300
                "
              >
                {label}

                <input
                  className={`${inputClass} mt-2`}
                  value={
                    String(
                      form[
                        field as
                        keyof FormState
                      ] ?? ""
                    )
                  }
                  onChange={
                    event =>
                      setForm(
                        current => ({
                          ...current,
                          [field]:
                            event.target
                              .value,
                        })
                      )
                  }
                />
              </label>
            )
          )}


          <label
            className="
              text-sm
              text-slate-300
              md:col-span-2
            "
          >
            Observações

            <textarea
              className={`${inputClass} mt-2 min-h-[120px]`}
              value={
                form.notes
              }
              onChange={
                event =>
                  setForm(
                    current => ({
                      ...current,
                      notes:
                        event.target.value,
                    })
                  )
              }
            />
          </label>


          <div
            className="
              flex
              justify-end
              md:col-span-2
            "
          >
            <button
              type="button"
              onClick={
                () =>
                  void saveVehicle()
              }
              disabled={saving}
              className="
                rounded-xl
                bg-cyan-500
                px-5
                py-3
                font-bold
                text-slate-950
                transition
                hover:bg-cyan-400
                disabled:opacity-50
              "
            >
              {saving
                ? "Salvando..."
                : "Salvar veículo"}
            </button>
          </div>

        </section>

      )}

    </div>
  );
}
