import React, { useState, useEffect } from "react";
import {
  LogoutOutlined,
  CalendarOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { Menu } from "antd";
import { useAuth } from "@/contexts/AuthContext";

function SideMenu() {
  const router = useRouter();
  const pathname = router.pathname;
  const [selectedKeys, setSelectedKeys] = useState(pathname);

  const { clearAuthState, getAuthState } = useAuth();

  useEffect(() => {
    setSelectedKeys(pathname);
  }, [pathname]);

  const signOut = () => {
    clearAuthState();
    router.push("/");
  };

  const menu = [
    {
      label: "Example Protected Route",
      key: "/protected",
      icon: <HomeOutlined />,
    },
    {
      label: "Events",
      key: "/events",
      icon: <CalendarOutlined />,
    },
  ];

  const authToken = getAuthState();
  if (authToken.decodedToken && authToken.decodedToken.canPostEvents) {
    menu.push({
      label: "Create Event",
      key: "/events/create",
      icon: <PlusOutlined />,
    });
  }

  return (
    <div className="SideMenu">
      <Menu
        mode="vertical"
        onClick={(item) => {
          if (item.key === "signOut") {
            signOut();
          } else {
            router.push(item.key);
          }
        }}
        selectedKeys={[selectedKeys]}
        items={menu}
      ></Menu>
      <Menu
        mode="vertical"
        onClick={(item) => {
          if (item.key === "signOut") {
            signOut();
          }
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Sign Out",
            key: "signOut",
            icon: <LogoutOutlined />,
          },
        ]}
      ></Menu>
    </div>
  );
}
export default SideMenu;