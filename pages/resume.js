import styles from "../styles/Resume.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons"; // Importa faGithub correctamente
import Image from "next/image";
import profilePic from "../images/christian.png";

const employmentData = [
  {
    title: "Developer at Dealer Inspire / Kopius Tech",
    website: "http://www.kopiustech.com",
    dateRange: "2020 ...",
    details: [
      "Developer for car dealership administration, reporting and advertisement services platforms PRIZM and FUEL.",
      "Tasks involving the implementation of Typescript, modernization of the UI codebase with the introduction of React hooks and optimizing routing strategy through React Router v6 to increase reusability while reducing dev time on new features.",
      "API maintenance tasks including creating migrations, creating new controller logic as well as upgrading existing to meet dynamic business requirements using the PHP/Laravel stack features such as Eloquent and Artisan.",
    ],
  },
  {
    title: "Developer at Deutsche Bank / GFT",
    website: "http://www.gft.com",
    dateRange: "2017 2019",
    details: [
      "Architect and design solutions for Deutsche Bank's home banking app leveraging ReactJs/redux, jQuery, and Java Spring.",
    ],
  },
  {
    title: "Developer at Tekii S.R.L",
    website: "http://www.tekii.srl",
    dateRange: "2016 2017",
    details: [
      "Designed a POC for a data ingestion monitoring dashboard for DirecTV combining JavaScript, Angular JS, D3js, HTML5, CSS.",
    ],
  },
  {
    title: "Developer at Hospital Alemán de Buenos Aires",
    website: "http://www.hospitalaleman.org",
    dateRange: "2015 2016",
    details: [
      "Implemented solutions for in-hospital communication and interfacing between departments through the design of medical applications.",
      "Technologies used: JavaScript, Sencha (ExtJS), HTML5, CSS",
    ],
  },
  {
    title: "Developer / UI Designer at Web.com",
    website: "http://www.web.com",
    dateRange: "2013 2015",
    details: [
      "Developer for StoreFront Project (e-commerce platform).",
      "UI developer for CTB (Click to Buy).",
    ],
  },
  {
    title: "Developer at Avatar",
    website: "http://www.avatarla.com",
    dateRange: "2009 2012",
    details: [
      "UI Designer for Coca Cola's Latin America Unified Websites for Brands (UWB) Project.",
      "UI Designer, Developer for Nestlé marketing websites – Purina Dog Chow, Cat Chow and Pro Plan.",
      "Worked with JavaScript, jQuery, CSS, Umbraco, ASP.NET.",
    ],
  },
  {
    title: "Developer at E-volution",
    website: "http://www.e-volution.com",
    dateRange: "2008 2009",
    details: [
      "Analyst / Developer for Microsoft Latam Email Marketing campaigns and microsites.",
      "Utilized ASP.NET, JavaScript, MS SQL Server technologies.",
      "Worked on Internal CMS and code generation tools like Net Tiers.",
    ],
  },
  {
    title: "Developer at Webar Interactive",
    website: "http://www.webar.com",
    dateRange: "2007 2008",
    details: [
      "Developer of online marketing campaigns for Nestlé / Procter & Gamble.",
      "Leveraged internal content management technology designed with Microsoft.NET.",
    ],
  },
  {
    title: "Developer at Paginar.Net",
    website: "http://www.paginar.net",
    dateRange: "2005 2007",
    details: [
      "Intranet development and maintenance for Marval O'farrell & Mairal (MOM).",
      "Intranet development and maintenance for SC Johnson.",
      "Web Developer for SITEAL, available at SITEAL Website.",
      "Used ASP 3.0 and JavaScript.",
    ],
  },
  {
    title: "Developer at Aquiles S.R.L",
    website: "http://www.achilles.com/es/aquiles-Argentina",
    dateRange: "2004 2005",
    details: [
      "Developer for projects: Controlar, Auditar, Siclar.",
      "Network admin & Active Directory management.",
      "Worked with ASP / ASP.NET technologies.",
    ],
  },
];

const CV = () => (
  <div className={`${styles.cvContainer} relative`}>
    {/* Header */}
    <header
      className={`${styles.header} absolute flex items-center bg-white ml-5 mt-5`}
    >
      <Image
        alt={"Profile picture"}
        src={profilePic}
        width={150}
        height={150}
      />
      <div className={"flex flex-col"}>
        <h1 className={`${styles.name} ml-5 mb-0`}>
          Christian Alejandro Agüero Chao
        </h1>{" "}
        {/* Título principal, clase ajustada */}
        <p
          className={`${styles.text} ${styles.textGray} font-bold ml-5 self-start`}
        >
          ^ Software engineer
        </p>
      </div>
    </header>

    {/* Columna Izquierda */}
    <div className={styles.leftColumn}>
      {/* Foto de perfil (añade la etiqueta img con tu foto) */}

      {/* Información de Contacto */}
      <div className={styles.contactInfo}>
        <p>
          <FontAwesomeIcon icon={faPhone} className={styles.icons} />
          <span>+34 654 740 420</span>
        </p>
        <p>
          <FontAwesomeIcon icon={faEnvelope} className={styles.icons} />{" "}
          <span>christian.aguero.1983@gmail.com</span>
        </p>
        <p>
          <FontAwesomeIcon icon={faGithub} className={styles.icons} />{" "}
          <span>github.com/christianLB</span>
        </p>
      </div>

      {/* Habilidades */}
      <div className={styles.skillsSection}>
        <h3 className={styles.sectionTitle}>Skills</h3>{" "}
        {/* Se aplicó la clase para título de sección */}
        <ul className={`${styles.text} ${styles.skills}`}>
          {[
            "React, Angular, VUE, Svelte",
            "Node, NextJs, PHP/Laravel, ORM",
            "HTML/CSS, GSAP, Chackra UI",
            "Docker, CI",
            "Product Development",
            "Requirements Gathering",
            "Implementation Coordination",
            "Process Documentation",
            "Scrum / Kanban",
          ].map((skill) => {
            return (
              <li key={skill}>
                <FontAwesomeIcon icon={faPencil} className={styles.icons} />
                <span className={styles.skill}>{skill}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Educación */}
      <div className={styles.educationSection}>
        <h3 className={styles.sectionTitle}>Education</h3>
        <p className={`${styles.subTitle} mb-2`}>2004 - 2007</p>
        <p className={styles.text}>Information Technology</p>
        <p className={`${styles.text} font-normal`}>
          Universidad Abierta Interamericana Buenos Aires, Argentina
        </p>
        {/* Más detalles educativos aquí */}
      </div>
    </div>

    {/* Columna Derecha */}
    <div className={styles.rightColumn}>
      {/* Abstract */}
      <div className={styles.abstract}>
        <p className={`${styles.text} ${styles.textGray}`}>
          <i>
            &quot;My drive is to address real-world challenges with efficient,
            innovative solutions. My foundation in web technologies aids in
            delivering practical, user-centric approaches to my projects. I have
            extensive experience in creating dynamic, responsive web
            applications, always with an eye on optimizing both user experience
            and performance. Beyond coding, my enthusiasm for teamwork, arts,
            and exploration fuels fresh, creative insights in my technical
            endeavors.&quot;
          </i>
        </p>
      </div>

      {/* Historial de Empleo */}

      <section className={styles.employmentHistory}>
        <h2 className={`${styles.sectionTitle}`}>Employment History</h2>

        {employmentData.map((job, index) => (
          <div key={index} className={styles.job}>
            <p className={`${styles.text} ${styles.textGray} ${styles.lineHeight} font-bold`}>
              {job.dateRange}
            </p>
            <div>
              <h3 className={`${styles.subTitle}`}>{job.title}</h3>
              <a
                href={job.website}
                className={`${styles.link} ${styles.textGray}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {job.website}
              </a>
              {job.details.map((detail, index) => (
                <p key={index} className={`${styles.text} ${styles.textGray}`}>
                  {detail}
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  </div>
);

export default CV;
