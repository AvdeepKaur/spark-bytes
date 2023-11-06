import React, { useState } from "react";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserAddOutlined,
} from "@ant-design/icons";
import { Card, Input, Typography, Button, message } from "antd";
import router from "next/router";

const Signup = () => {
  //creates a path to the index page
  const index = () => {
    router.push("/");
  };

  //creates the state variables for each of the input boxes
  const [nameText, setNameText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");

  //the emailRegex for all the characters in a valid email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //the passwordRegex sets the requirement for a valid password
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  function handleSignUpClick() {
    //doesn't validate an username less than 3 characters
    if (nameText.length < 3) {
      message.error("Invalid Username");
      return;
      //checks the characters of the emailText to see if it contains the proper characters to form an email
    } else if (!emailRegex.test(emailText)) {
      message.error("Invalid Email Address");
      return;
      //makes sure the email has a set amount of characters and has at least one capital letter
    } else if (!passwordRegex.test(passwordText)) {
      message.error(
        "Invalid Password. Must be greater than 8 characters and include a number and an uppercase letter"
      );
      return;
      //if it passes all the requirements it needs to match the code with the signUp route
    } else {
      //a post request to the api
      fetch("/api/signup", {
        //posts the user inputs into the database
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameText,
          email: emailText,
          password: passwordText,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
            //handles registration errors
          } else if (response.status === 400) {
            return response.json().then((data) => {
              // Display the error message from the backend to the user
              message.error(data.message);
            });
          }
          throw new Error("Network response was not ok.");
        })
        .then((data) => {
          // redirects to the login page for now but can be updated to just send the user to the "/protected" page
          router.push("/login");
          //the following is only when taking the user to the protected page as it stores the token
          //localStorage.setItem("token", data.token);
        })
        //catches unknown errors to the console
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#eaf7f0",
        }}
      >
        <Card
          style={{
            width: 430,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            className="inputs"
            style={{
              boxSizing: "border-box",
              padding: "20px",
              width: "100%",
            }}
          >
            <Typography.Title
              level={2}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Sign Up
            </Typography.Title>
            <Typography.Paragraph
              style={{ color: "grey", marginBottom: "5px" }}
            >
              Name
            </Typography.Paragraph>
            <Input
              placeholder="Name"
              style={{ marginBottom: "20px" }}
              onChange={(e) => setNameText(e.target.value)}
            />
            <Typography.Paragraph
              style={{ color: "grey", marginBottom: "5px" }}
            >
              Email Address
            </Typography.Paragraph>
            <Input
              placeholder="Email"
              style={{ marginBottom: "20px" }}
              onChange={(e) => setEmailText(e.target.value)}
            />
            <Typography.Paragraph
              style={{ color: "grey", marginBottom: "5px" }}
            >
              Password
            </Typography.Paragraph>
            <Input.Password
              placeholder="Password"
              style={{ marginBottom: "20px" }}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              onChange={(e) => setPasswordText(e.target.value)}
            />
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#66BB6A",
                border: "none",
                color: "white",
                margin: "20px 0",
                width: "100%",
              }}
              onClick={handleSignUpClick}
            >
              <UserAddOutlined />
              Sign Up{" "}
            </Button>
            <Button
              type="link"
              block
              style={{
                color: "#66BB6A",
                fontWeight: 600,
              }}
              onClick={index}
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Signup;
