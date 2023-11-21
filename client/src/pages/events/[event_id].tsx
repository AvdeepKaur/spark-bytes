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
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [filteredTag, setFilteredTag] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [sortDesc, setSortDesc] = useState<boolean>(false);

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
  const ev1 = events.find((ev) => ev.event_id === Number(event_id));
  return (
    <div>
      <p>
        event id: {ev1?.event_id}
        created by: {ev1?.createdBy.name}
        tags: {ev1?.location?.Address}
      </p>
    </div>
  );
};

export default Events;
