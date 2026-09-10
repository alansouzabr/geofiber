"use client";

import SearchBox from "../../common/SearchBox";

import CompanyBadge from "./CompanyBadge";
import NotificationButton from "./NotificationButton";
import UserMenu from "./UserMenu";

export default function Header(){

  return(

    <header
      className="
        h-24
        border-b
        border-slate-800
        bg-[#07111f]
        px-10
        flex
        items-center
        justify-between
      "
    >

      <SearchBox
        placeholder="Pesquisar projetos..."
      />

      <div
        className="
          flex
          items-center
          gap-5
        "
      >

        <CompanyBadge />

        <NotificationButton />

        <UserMenu />

      </div>

    </header>

  );

}
