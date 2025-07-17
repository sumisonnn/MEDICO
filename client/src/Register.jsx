import { Navigate, useNavigate } from "react-router-dom";

function Register(){
    cons{register,handleSubmit} = userForm();
    const navigation =useNavigate;

    const onSubmit = (data) => {
        localStorage.setItem("user",JSON.stringify(data));
        alert("Register successful");
        Navigate("/login");
    }
}