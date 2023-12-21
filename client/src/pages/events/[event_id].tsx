import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { message, Table, Tag } from "antd";
import { API_URL } from "../../common/constants";
import { useAuth } from "@/contexts/AuthContext";
import { IEvent, ITag } from "../../common/interfaces";

interface TableRecord {
  key: string;
  field: string;
  value: any;
}

const Events: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<IEvent[]>([]);
  const router = useRouter();
  const { event_id } = router.query;
  const { getAuthState } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const eventsResponse = await fetch(`${API_URL}/api/events/`, {
          headers: {
            Authorization: `Bearer ${getAuthState()?.token}`,
          },
          credentials: "include",
        });

        if (!eventsResponse.ok) {
          throw new Error(`${eventsResponse.status}`);
        }

        const responseJSON = await eventsResponse.json();
        setEvents(responseJSON.events);
      } catch (error) {
        message.error(
          "An error occurred while fetching events. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [getAuthState]);

  const selectedEvent = events.find(
    (ev: { event_id: number }) => ev.event_id === Number(event_id)
  );
  console.log("Selected Event:", selectedEvent);

  const columns = [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value: any, record: TableRecord) => {
        if (record.field === "tags") {
          return (value as ITag[]).map((tag) => (
            <Tag key={tag.tag_id}>{tag.name}</Tag>
          ));
        }
        if (record.field === "location") {
          console.log("Location Value:", value);
          if (
            value &&
            value.Address !== undefined &&
            value.floor !== undefined &&
            value.room !== undefined
          ) {
            return `${value.Address}, Floor ${value.floor}, Room ${value.room}`;
          } else {
            return "Not specified";
          }
        }
        if (record.field == "createdBy") {
          return `${value.name}`;
        }

        if (record.field === "photos") {
          // Assuming 'value' is an array of objects with a 'photo' property
          return value.map((photoObj: { photo: any }, index: any) => (
            <img
              key={index}
              src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=`} // Replace 'jpeg' with the correct format, if necessary
              alt={`Event Photo ${index}`}
              style={{ maxWidth: "100px", maxHeight: "100px" }} // Adjust styles as needed
            />
          ));
        }
        //if (record.field === '' && value) {
        //  return `${}`
        //}
        return value;
      },
    },
  ];

  // Convert the selected event into a format suitable for Ant Design Table
  const tableData = selectedEvent
    ? Object.entries(selectedEvent).map(([key, value]) => ({
        key,
        field: key,
        value:
          key === "tags" ||
          key === "createdBy" ||
          key === "photos" ||
          key === "location"
            ? value
            : value?.toString(),
      }))
    : [];

  return (
    <div style={{ marginLeft: "200px", borderColor: "red" }}>
      <Table
        loading={isLoading}
        dataSource={tableData}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

export default Events;
