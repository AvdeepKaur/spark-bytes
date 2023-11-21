import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { message, Table, Tag } from 'antd';
import { API_URL } from '../../common/constants';
import { useAuth } from '@/contexts/AuthContext';
import { IEvent, ITag } from '../../common/interfaces';

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
        });

        if (!eventsResponse.ok) {
          throw new Error(`${eventsResponse.status}`);
        }

        const responseJSON = await eventsResponse.json();
        setEvents(responseJSON.events);
      } catch (error) {
        message.error("An error occurred while fetching events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [getAuthState]);

  const selectedEvent = events.find((ev) => ev.event_id === Number(event_id));

  const columns = [
    {
      title: 'Field',
      dataIndex: 'field',
      key: 'field',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: any, record: TableRecord) => { 
        if (record.field === 'tags') {
          return (value as ITag[]).map((tag) => (
            <Tag key={tag.tag_id}>{tag.name}</Tag>
          ));
        }
        if (record.field === 'location' && value) {
          return `${value.Address}, Floor ${value.floor}, Room ${value.room}`;
        }
        return value;
      },
    },
  ];

  // Convert the selected event into a format suitable for Ant Design Table
  const tableData = selectedEvent ? Object.entries(selectedEvent).map(([key, value]) => ({
    key,
    field: key,
    value: (key === 'tags' || key === 'createdBy') ? value : value.toString(),
  })) : [];

  return (
    <div style={{marginLeft:'200px',borderColor:'red'}}>
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
