// src/components/CreateItemForm.js
import React, { useState } from "react";
import ReactModal from "react-modal";
import styled from "@emotion/styled";
import axios from "axios";

const ModalContainer = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormInput = styled.input`
  display: block;
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const FormSelect = styled.select`
  display: block;
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  background: #fff;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const FormButton = styled.button`
  display: block;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
  }
`;

const ModalButton = styled.button`
  margin: 10px;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

ReactModal.setAppElement("#root"); // Set the app element for accessibility

const CreateItemForm = ({ isModalOpen, closeModal, refreshData }) => {
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    type: "Open",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/kanban/items", newItem);
      refreshData(); // Refresh the columns data
      setNewItem({ title: "", description: "", type: "Open" });
      closeModal(); // Close the modal after submission
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Add New Item"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          padding: "20px",
          border: "none",
          borderRadius: "8px",
          maxWidth: "600px",
          margin: "auto",
        },
      }}
    >
      <ModalContainer>
        <h3>Add New Item</h3>
        <form onSubmit={handleSubmit}>
          <FormInput
            type="text"
            name="title"
            placeholder="Title"
            value={newItem.title}
            onChange={handleInputChange}
            required
          />
          <FormInput
            type="text"
            name="description"
            placeholder="Description"
            value={newItem.description}
            onChange={handleInputChange}
          />
          <FormSelect
            name="type"
            value={newItem.type}
            onChange={handleInputChange}
          >
            <option value="Open">Open</option>
            <option value="Overdue">Overdue</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </FormSelect>
          <FormButton type="submit">Add Item</FormButton>
        </form>
      </ModalContainer>
    </ReactModal>
  );
};

export default CreateItemForm;
