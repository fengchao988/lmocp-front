import React from "react";
import styles from "./index.less";
import { CopyrightOutlined } from "@ant-design/icons";

const LoginWrapper = (props) => {
  return (
    <div className={styles.login}>
      {/*<img src='/logo.png' width={100} height={100}/>*/}
      <span className={styles.title}>巴彦高勒煤矿精益市场化运营管控平台</span>
      <span className={styles.subtitle}>巴勒煤业</span>
      {props.children}
      <div className={styles.footer}>
        <div className={styles.links}></div>
        <div className={styles.copyright}>
          Copyright
          <CopyrightOutlined />
          2019 <span>山东能源数智云科技 出品</span>
        </div>
      </div>
    </div>
  );
};

export default LoginWrapper;
