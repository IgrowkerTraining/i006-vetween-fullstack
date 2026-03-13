import React from "react";
import { useNavigate } from "react-router-dom";
import notFoundImage from "../assets/notfound.png";
import { Button } from "../components/common/Button";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECECF3] px-4 py-10">
      <section className="w-full max-w-[660px] rounded-xl border border-[#BCD3E8] bg-[#ECECF3] px-6 py-12 text-center shadow-sm sm:px-10">
        <img
          src={notFoundImage}
          alt="Página no encontrada"
          className="mx-auto mb-6 w-[150px] max-w-full"
        />
        <h1 className="mb-3 text-4xl font-bold leading-tight text-[#171717] sm:text-[38px]">
          Página no encontrada
        </h1>
        <p className="mb-8 text-lg text-[#2C2C2C]">
          No encontramos la página que estás buscando.
        </p>
        <Button
          type="button"
          onClick={handleBack}
          className="mx-auto min-w-28 px-8 py-2.5 text-base"
        >
          Volver
        </Button>
      </section>
    </div>
  );
};

export default NotFound;
