import { useEffect, FC, useState } from "react";
import { useRouter } from "next/router";
import {
  List,
  Card,
  Pagination,
  message,
  Typography,
  Select,
  Button,
  Tag,
  Form,
  Input,
  DatePicker,
} from "antd";
import { API_URL } from "../../common/constants";
import { IAuthTokenDecoded, IEvent, ITag } from "../../common/interfaces";
import { FilterOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "@/contexts/AuthContext";
const { Paragraph } = Typography;
const { Option } = Select;

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
  // const [description, setDescription] = useState("");
  // const [quantity, setQuantity] = useState("");
  // const [expTime, setExpTime] = useState("");
  // const [tag, setTag] = useState("");

  const router = useRouter();
  const { getAuthState, authState } = useAuth();
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
          console.log("error");
          throw new Error(`${eventsResponse.status}`);
        }

        const responseJSON = await eventsResponse.json();
        const eventsData = responseJSON.events;
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

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
  };

  const getPageEvents = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    let filteredEvents = events;

    // Filter tags
    if (filteredTag !== null) {
      filteredEvents = filteredEvents.filter((event) =>
        event.tags?.some((tag) => (tag as ITag).name === filteredTag)
      );
    }

    // Filter events by expiration date in descending order
    filteredEvents.sort((a, b) => {
      if (sortDesc) {
        // sort in descending order
        return dayjs(b.exp_time).valueOf() - dayjs(a.exp_time).valueOf();
      } else {
        // sort in ascending order
        return dayjs(a.exp_time).valueOf() - dayjs(b.exp_time).valueOf();
      }
    });

    return filteredEvents.slice(startIndex, endIndex);
  };

  const handleEventClick = (event: IEvent) => {
    setSelectedEvent(event);
    router.push(`/events/${event.event_id}`); // Navigate to the view page
  };

  return (
    <div
      style={{
        backgroundColor: "#eaf7f0",
        padding: "20px",
        width: "100%",
        height: "100%",
      }}
    >
      <Typography.Title
        level={2}
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        {"Upcoming Events"}
      </Typography.Title>
      <Button
        type="primary"
        style={{ marginBottom: "16px", backgroundColor: "#66BB6A" }}
        onClick={() => setIsFilterVisible(!isFilterVisible)}
        icon={<FilterOutlined />}
      >
        Filter
      </Button>

      {isFilterVisible && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "16px",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <Paragraph style={{ color: "black", lineHeight: "3" }}>
              Tag:{" "}
              <Select
                value={filteredTag}
                style={{ width: 200 }}
                placeholder="Select Tags"
                onChange={(value) => setFilteredTag(value)}
              >
                <Option value={null}>All</Option>
                {events
                  .reduce<string[]>((tags, event) => {
                    const eventTags =
                      event.tags?.map((tag) => (tag as ITag).name) || [];
                    return Array.from(new Set([...tags, ...eventTags]));
                  }, [])
                  .map((tag) => (
                    <Option key={tag} value={tag}>
                      {tag}
                    </Option>
                  ))}
              </Select>
            </Paragraph>
            <Paragraph style={{ color: "black", lineHeight: "3" }}>
              Sort by Expiration Date:{" "}
              <Button
                style={{ marginBottom: "16px" }}
                onClick={() => setSortDesc(!sortDesc)}
              >
                {sortDesc ? "Descending Order" : "Ascending Order"}
              </Button>
            </Paragraph>
          </div>
        </div>
      )}
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        dataSource={getPageEvents()}
        loading={isLoading}
        renderItem={(event: IEvent) => (
          <List.Item>
            <Card
              onClick={() => handleEventClick(event)}
              title={`Event ID: ${event.event_id}`}
              style={{
                backgroundColor: "white",
                borderRadius: "0.625rem",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {event.createdById == authState?.decodedToken?.id && (
                <div
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: "20px",
                    zIndex: 1,
                  }}
                >
                  <Tag
                    color="#66BB6A"
                    style={{
                      borderRadius: "0.625rem",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      padding: "1px 6px",
                      fontSize: "12px",
                    }}
                  >
                    <UserOutlined
                      style={{ marginRight: "4px", fontSize: "12px" }}
                    />
                    My Event
                  </Tag>
                </div>
              )}
              <Paragraph
                style={{
                  color: "#66BB6A",
                  fontSize: "12px",
                  marginBottom: "6px",
                }}
              >
                Post Time: {dayjs(event.post_time).format("YYYY-MM-DD HH:mm")}{" "}
                <br />
                Expire Time: {dayjs(event.exp_time).format("YYYY-MM-DD HH:mm")}
              </Paragraph>
              <Paragraph style={{ color: "black", lineHeight: "3" }}>
                Created by: {event.createdBy.name} <br />
                Description: {event.description} <br />
                Quantity: {event.qty} <br />
                Tags:{" "}
                {event.tags && event.tags.length > 0
                  ? event.tags.map((tag, index) => (
                    <span key={(tag as ITag).tag_id}>
                      {(tag as ITag).name}
                      {index !== event.tags.length - 1 && ", "}
                    </span>
                  ))
                  : " Not specified"}
                <br />
                Location:{" "}
                {event.location
                  ? `${event.location.Address}, Floor ${event.location.floor}, Room ${event.location.room}`
                  : "Not specified"}
              </Paragraph>
            </Card>
          </List.Item>
        )}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalEvents}
          onChange={handlePageChange}
          style={{ marginTop: "20px" }}
        />
      </div>

      {/* <Typography.Title
        level={2}
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        Create an Event
      </Typography.Title>

      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="vertical"
        style={{ maxWidth: 600 }}
        onFinish={createEvent}
      >
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input onChange={(e) => setDescription(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[
            { required: true },
            { pattern: /^[0-9]+$/, message: "Please enter a number." },
          ]}
        >
          <Input onChange={(e) => setQuantity(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Expiration Time"
          name="expTime"
          rules={[{ required: true }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            onChange={(date, dateString) => setExpTime(dateString)}
          />
        </Form.Item>
        <Form.Item label="Tag" name="tag" rules={[{ required: true }]}>
          <Input onChange={(e) => setTag(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "rgb(102, 187, 106)" }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form> */}
    </div>
  );
};

export default Events;
