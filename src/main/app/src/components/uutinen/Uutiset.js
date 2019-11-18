import React from 'react';
import Uutinen from "./Uutinen";

const Uutiset = props =>
    props.uutiset.map((u, index) =>
        <Uutinen id={u.id}
                 key={`uutinen-${index}-${u.id}`}/>);

export default Uutiset;
