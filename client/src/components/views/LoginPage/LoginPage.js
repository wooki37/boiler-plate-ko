import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";

function LoginPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {
      email: Email,
      password: Password
    };

    dispatch(loginUser(body))
    .then(response => {
      const data = response?.payload ?? response;
      if (data?.loginSuccess) {
        navigate("/");
      }
      else {
        alert(data?.message || "로그인 실패. 이메일 또는 비밀번호를 확인해주세요.");
      }
    });
  }

  return (
    <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
        }}>
          <form style={{ display: 'flex', flexDirection: 'column' }}
          onSubmit={onSubmitHandler}
          >
            <label>Email</label>
            <input type="email" value={Email} onChange={onEmailHandler} />
            <label>Password</label>
            <input type="password" value={Password} onChange={onPasswordHandler} />
            <br />
            <button>Login</button>
          </form>
    </div>
  );
}

export default LoginPage;