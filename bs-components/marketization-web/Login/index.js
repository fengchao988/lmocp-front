import React from 'react';
import { Row } from 'antd';
import LoginWrapper from "../LoginWrapper";
import AccountLogin from './AccountLogin';

const Login = ({ loading, login }) => {
    return (
        <LoginWrapper>
            <div style={{ width: 370, margin: '0 auto'}}>
                <Row justify="center">
                    <AccountLogin loading={loading} login={login}/>
                </Row>
            </div>
        </LoginWrapper>
    );
};

Login.propTypes = AccountLogin.propTypes;

Login.defaultProps = AccountLogin.defaultProps;

export default Login;
