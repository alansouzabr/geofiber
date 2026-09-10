"use client";

import {
  CreditCard,
  QrCode,
  CheckCircle2,
  Users,
  FileText
} from "lucide-react";

interface Props {
  plan: any;
  current?: boolean;
}

export default function PlanCard({
  plan,
  current
}: Props) {

  const price =
    (plan.price / 100)
      .toFixed(2)
      .replace(".", ",");

  async function handleCheckout() {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const res =
        await fetch(
          "https://api.geofibers.com.br/billing/checkout",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body: JSON.stringify({
              planId: plan.id
            })
          }
        );

      const data =
        await res.json();

      if (data.url) {

        window.location.href =
          data.url;
      }

    } catch (err) {

      console.error(err);

      alert(
        "Erro ao iniciar checkout"
      );
    }
  }



  return (

    <div
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        transition-all
        duration-300
        p-6
        min-w-[320px]
        bg-slate-950
        ${
          current
            ? "border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
            : "border-slate-800 hover:border-cyan-700"
        }
      `}
    >

      {current && (

        <div
          className="
            absolute
            top-4
            right-4
            flex
            items-center
            gap-2
            bg-cyan-500/20
            text-cyan-300
            px-3
            py-1
            rounded-full
            text-xs
            font-bold
          "
        >

          <CheckCircle2 size={14} />

          Plano Atual

        </div>
      )}

      <div className="mb-6">

        <h2
          className="
            text-3xl
            font-black
            text-white
          "
        >
          {plan.name}
        </h2>

        <div
          className="
            mt-4
            flex
            items-end
            gap-2
          "
        >

          <span
            className="
              text-5xl
              font-black
              text-cyan-400
            "
          >
            R$ {price}
          </span>

          <span
            className="
              text-slate-500
              mb-1
            "
          >
            /mês
          </span>

        </div>

      </div>

      <div
        className="
          flex
          flex-col
          gap-4
          mb-8
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            text-slate-300
          "
        >

          <Users size={18} />

          <span>
            {plan.maxUsers}
            {" "}usuários
          </span>

        </div>

        <div
          className="
            flex
            items-center
            gap-3
            text-slate-300
          "
        >

          <FileText size={18} />

          <span>
            {plan.maxTrts}
            {" "}TRTs
          </span>

        </div>

      </div>

      <div
        className="
          flex
          flex-col
          gap-3
        "
      >

        {current ? (

          <button
            disabled
            className="
              w-full
              py-3
              rounded-2xl
              bg-cyan-500
              text-slate-950
              font-black
            "
          >
            Plano Atual
          </button>

        ) : (

          <>

            <button
              className="
                w-full
                py-3
                rounded-2xl
                bg-cyan-500
                hover:bg-cyan-400
                transition
                text-slate-950
                font-black
                flex
                items-center
                justify-center
                gap-2
              "
            >

              <QrCode size={18} />

              Pagar com PIX

            </button>

            <button
              onClick={handleCheckout}
              className="
                w-full
                py-3
                rounded-2xl
                bg-slate-800
                hover:bg-slate-700
                transition
                text-white
                font-bold
                flex
                items-center
                justify-center
                gap-2
              "
            >

              <CreditCard size={18} />

              Cartão

            </button>

          </>

        )}

      </div>

    </div>
  );
}
