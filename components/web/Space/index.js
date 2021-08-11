import React from 'react';
import { Space as AntdSpace } from 'antd';

const Space = ({ children, ...restProps}) => {
    return <AntdSpace style={{ width: '100%'}} {...restProps}>
        {React.Children.map(children, child=> React.cloneElement(child))}
    </AntdSpace>
};

export default Space;