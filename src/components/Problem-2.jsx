import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const Problem2 = () => {
    const [allContactsModalVisible, setAllContactsModalVisible] = useState(false);
    const [usContactsModalVisible, setUsContactsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [onlyEven, setOnlyEven] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [modalCVisible, setModalCVisible] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [nextPage, setNextPage] = useState('');

    const fetchContacts = async (page = 1) => {
        try {
            const response = await axios.get(`https://contact.mediusware.com/api/contacts/?page=${page}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching contacts:', error);
            return null;
        }
    };

    const loadContacts = async (page = 1) => {
        const data = await fetchContacts(page);
        if (data) {
            setContacts(prevContacts => (page === 1 ? data.results : [...prevContacts, ...data.results]));
            setNextPage(data.next);
        }
    };

    const handleAllContactsClick = () => {
        setAllContactsModalVisible(true);
        setUsContactsModalVisible(false);
        loadContacts();
    };

    const handleUsContactsClick = () => {
        setAllContactsModalVisible(false);
        setUsContactsModalVisible(true);
        // Filter only US contacts
        const usContacts = contacts.filter(contact => contact.country.name === 'United States');
        setContacts(usContacts);
    };

    const handleCloseModals = () => {
        setAllContactsModalVisible(false);
        setUsContactsModalVisible(false);
    };

    const handleOpenModalC = (contact) => {
        setSelectedContact(contact);
        setModalCVisible(true);
    };

    const handleCloseModalC = () => {
        setModalCVisible(false);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = () => {
        loadContacts();
    };

    const handleModalButtonClick = (country) => {
        if (country === 'all') {
            handleAllContactsClick();
        } else if (country === 'us') {
            handleUsContactsClick();
        }
    };

    const handleInfinityScroll = () => {
        if (nextPage) {
            const page = nextPage.split('=').pop();
            loadContacts(page);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleInfinityScroll);
        return () => {
            window.removeEventListener('scroll', handleInfinityScroll);
        };
    }, [nextPage]);

    return (
        <div className="container">
        <div className="row justify-content-center mt-5">
            <h4 className='text-center text-uppercase mb-5'>Problem-2</h4>

            <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-lg btn-outline-primary" type="button" onClick={handleAllContactsClick} style={{ backgroundColor: '#46139f', color: 'white' }}>All Contacts</button>
                <button className="btn btn-lg btn-outline-warning" type="button" onClick={handleUsContactsClick} style={{ backgroundColor: '#ff7f50', color: 'white' }}>US Contacts</button>
            </div>

            <Modal show={allContactsModalVisible || usContactsModalVisible} onHide={handleCloseModals}>
                <Modal.Header closeButton style={{ backgroundColor: '#46139f', color: 'white' }}>
                    <Modal.Title>{allContactsModalVisible ? 'All Contacts' : 'US Contacts'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="searchInput">
                        <Form.Control
                            type="text"
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <Button variant="primary" onClick={handleSearchSubmit} style={{ backgroundColor: '#46139f', color: 'white' }}>Search</Button>
                    </Form.Group>

                    <ul>
                        {contacts
                            .filter(contact => (!onlyEven || contact.id % 2 === 0) && contact.phone.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(contact => (
                                <li key={contact.id} onClick={() => handleOpenModalC(contact)}>
                                    {contact.phone} - {contact.country.name}
                                </li>
                            ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => handleModalButtonClick('all')} style={{ backgroundColor: '#46139f', color: 'white' }}>All Contacts</Button>
                    <Button variant="warning" onClick={() => handleModalButtonClick('us')} style={{ backgroundColor: '#ff7f50', color: 'white' }}>US Contacts</Button>
                    <Button variant="light" onClick={handleCloseModals} style={{ backgroundColor: 'white', border: '1px solid #46139f', color: '#46139f' }}>Close</Button>
                    <Form.Check type="checkbox" label="Only even" checked={onlyEven} onChange={() => setOnlyEven(!onlyEven)} />
                </Modal.Footer>
            </Modal>

            <Modal show={modalCVisible} onHide={handleCloseModalC}>
                <Modal.Header closeButton style={{ backgroundColor: '#46139f', color: 'white' }}>
                    <Modal.Title>Contact Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>ID: {selectedContact?.id}</p>
                    <p>Phone: {selectedContact?.phone}</p>
                    <p>Country: {selectedContact?.country.name}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleCloseModalC} style={{ backgroundColor: 'white', border: '1px solid #46139f', color: '#46139f' }}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    </div>
    );
};

export default Problem2;
