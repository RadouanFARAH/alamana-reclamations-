import React, { useEffect, useRef, useState } from 'react'
import "./login.css"
import { UtilisateurService } from '../service/UtilisateurService'
import { Toast } from 'primereact/toast'

const Login = () => {
    const [sAMAccountName, setSAMAccountName] = useState("")
    const [password, setPassword] = useState("")
    const toast = useRef(null);
   const login=()=>{
       const utilisateurService = new UtilisateurService()
       utilisateurService.login({sAMAccountName,password}).then(res=>{            
           if (res.error) {
               console.log("error")
               toast.current.show({ severity: 'error', summary: 'Erreur ', detail: res.message || 'Vous n\'êtes pas connecté!!!', life: 3000 });          
           } 
           else{
                  localStorage.setItem('token',res.message.token)
                  localStorage.setItem('sAMAccountName',res.message.user.sAMAccountName)
                  localStorage.setItem('displayName',res.message.user.displayName)
                  localStorage.setItem('role',res.message.user.role)
                  toast.current.show({ severity: 'success', summary: 'succès ', detail: 'Vous êtes connecté', life: 3000 });
           
                  window.location.href="/"            
           }
       })
   }
    
    return (
        <div>
            <Toast ref={toast} />
            <div className="container-login">
                <div className="forms-container-login">
                    <div className="signin-signup">
                        <form className="form-login sign-in-form">
                            <h2 className="title">Se connecter</h2>
                            <div className="input-field">
                                <i className="fas fa-user" />
                                <input value={sAMAccountName} onChange={(e) => setSAMAccountName(e.target.value)} type="text" placeholder="Nom d'utilisateur" />
                            </div>
                            <div className="input-field">
                                <i className="fas fa-lock" />
                                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mot de passe" />
                            </div>
                                <input onClick={login} type="button" defaultValue="Connexion" className="btn-login solid" />
                           
                            
                        </form>
                    </div>
                </div>
                <div className="panels-container-login">
                    <div className="panel left-panel">
                        <div className="content-logo" >
                            <img src="./assets/layout/images/logo-white-img.png" alt="" /><br />
                            <img src="./assets/layout/images/logo-white-text.png" alt="" />
                        </div>
                        <img src="./images/logo.svg" className="image" alt="" />
                    </div>
                    <div className="panel right-panel">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
