import { useEffect, FC, useState } from "react";
import { useRouter } from "next/router";
import { message } from "antd";
import { API_URL } from "../../common/constants";
import { IAuthTokenDecoded, IEvent, ITag } from "../../common/interfaces";
import { useAuth } from "@/contexts/AuthContext";
import { id } from "date-fns/locale";

interface ITokenState {
  rawToken: string;
  decodedToken: IAuthTokenDecoded;
}
const Events: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [totalEvents, setTotalEvents] = useState<number>(0);

  const router = useRouter();
  const { event_id } = router.query;
  const { getAuthState, authState } = useAuth();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const eventsResponse = await fetch(`${API_URL}/api/events/`, {
          headers: {
            Authorization: `Bearer ${getAuthState()?.token}`,
          },
        });

        if (!eventsResponse.ok) {
          console.log("error");
          throw new Error(`${eventsResponse.status}`);
        }

        const responseJSON = await eventsResponse.json();
        const eventsData = await responseJSON.events;
        setEvents(eventsData);
        setIsLoading(false);
        setTotalEvents(eventsData.length);
      } catch (error) {
        console.error(error);
        message.error(
          "An error occurred while fetching events. Please try again later."
        );
      }
    };
    fetchEvents();
  }, [getAuthState]);

  console.log(events);
  const selectedEvent = events.find((ev) => ev.event_id === Number(event_id));
  return (
    <div>
      <p>
        createdAt: {selectedEvent?.createdAt}
        createdBy: {selectedEvent?.createdBy.name}
        createdById: {selectedEvent?.createdById}
        description: {selectedEvent?.description}
        done: {selectedEvent?.done}
        event_id: {selectedEvent?.event_id}
        exp_time: {selectedEvent?.exp_time}
        post_time: {selectedEvent?.post_time}
        qty: {selectedEvent?.qty}
        updatedAt: {selectedEvent?.updatedAt}
        tags:{" "}
        {selectedEvent?.tags && selectedEvent?.tags.length > 0
          ? selectedEvent.tags.map((tag, index) => (
              <span key={(tag as ITag).tag_id}>
                {(tag as ITag).name}
                {index !== selectedEvent.tags.length - 1 && ", "}
              </span>
            ))
          : " Not specified"}
        location:{" "}
        {selectedEvent?.location
          ? `${selectedEvent.location.Address}, Floor ${selectedEvent.location.floor}, Room ${selectedEvent.location.room}`
          : "Not specified"}
      </p>
    </div>
  );
};

export default Events;
