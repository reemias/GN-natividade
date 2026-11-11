import { useState, useEffect } from "react";
import style from "./slide.module.css";
import imagem1 from "../../img/reparo.png";
import imagem2 from "../../img/Galeria.png";
import imagem3 from "../../img/reparo.png";

const imagens = [imagem1, imagem2, imagem3];

function Slide() {
  const [indiceAtual, setIndiceAtual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceAtual((prev) => (prev + 1) % imagens.length);
    }, 3000); // troca a cada 3 segundos

    return () => clearInterval(intervalo); // limpa ao desmontar
  }, []);

  return (
    <div className={style.slideContent}>
      {imagens.map((img, index) => (
        <div
          key={index}
          className={`${style.slideImagem} ${
            index === indiceAtual ? style.ativo : ""
          }`}
        >
          <img src={img} alt={`Imagem ${index + 1}`} />
        </div>
      ))}
    </div>
  );
}

export default Slide;
