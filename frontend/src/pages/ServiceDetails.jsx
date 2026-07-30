import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Image, Button } from 'react-bootstrap';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      const { data } = await axios.get(`/api/services/${id}`);
      setService(data);
    };
    fetchService();
  }, [id]);

  if (!service) return <p>Loading...</p>;

  return (
    <Row>
      <Col md={6}>
        <Image src={service.image || '/default-service.jpg'} alt={service.name} fluid rounded />
      </Col>
      <Col md={6}>
        <h2>{service.name}</h2>
        <p>{service.description}</p>
        <h4>Price: ${service.price}</h4>
        <Button variant="success">Book Now</Button>
      </Col>
    </Row>
  );
};

export default ServiceDetails;