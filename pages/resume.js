import styles from "../styles/Resume.module.css";

const CV = () => {
  return (
    <div className={styles.a4}>
      {/* Contenido del CV aquí */}
      <div className={styles.column} id="left-column">
        {/* Información personal, habilidades, idiomas */}
      </div>
      <div className={styles.column} id="right-column">
        {/* Historial laboral, educación */}
      </div>
      <button onClick={() => window.print()} className={styles.printButton}>
        Imprimir CV
      </button>
    </div>
  );
};

export default CV;
