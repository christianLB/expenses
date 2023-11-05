import styles from "../styles/Resume.module.css";

const ResumePage = () => {
  return (
    <div className={styles.resume}>
      <div className={styles.header}>
        <h1 className={'h1'}>Dani Schwaiger</h1>
        <h2 className={'h2'} >Web Developer</h2>
      </div>
      <div className={styles.contactInfo}>
        <p>123-456-7890</p>
        <p>hello@reallygr eatsite.com</p>
        <p>123 Anywhere St., Any City</p>
        <p>reallygreatsite.com</p>
      </div>
      <div className={styles.profile}>
        <h3 className={'h3'}>Profile</h3>
        <p>{/* Profile info goes here */}</p>
      </div>
      <div className={styles.skills}>
        <h3 className={'h3'}>Skills</h3>
        <ul>{/* Skill list goes here */}</ul>
      </div>
      <div className={styles.experience}>
        <h3 className={'h3'}>Experience</h3>
        {/* Experience items go here */}
      </div>
      <div className={styles.education}>
        <h3 className={'h3'}>Education</h3>
        {/* Education items go here */}
      </div>
    </div>
  );
};

export default ResumePage;
