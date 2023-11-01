import React, { useEffect, useState } from 'react';
import axios from "axios";
import { FaPencil, FaTrashCan } from 'react-icons/fa6';


export default function CrudUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [operacao, setOperacao] = useState("");


  const url = "react-backend-gamma.vercel.app/usuarios/"
  
  useEffect(() => {
    fetch(url)
    .then((respFetch) => respFetch.json())
    .then((respJson) => setUsuarios(respJson))
    .catch((err) => console.log(err));
    }, [url]);
  
  return (
    <div>
      <h1>Titulo</h1>
    </div>
  )
}
