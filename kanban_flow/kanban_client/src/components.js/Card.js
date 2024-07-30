import React from "react";
import styles from "../assets/css/Card.module.css";

function Card({ item }) {
  return (
    <div className={styles["Card"]}>
      <div className={styles["Card-header"]}>
        <h3>{item.title}</h3>
      </div>
      <div className={styles["Card-content"]}>
        <p>{item.description}</p>
      </div>
    </div>
  );
}

export default Card;
