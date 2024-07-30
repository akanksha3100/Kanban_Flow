import React, { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
import axios from "axios";
import CreateItemForm from "./CreateItemForm";

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow-x: auto;
  padding: 20px;
`;

const TaskList = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  background: #f3f3f3;
  min-width: 232px;
  border-radius: 5px;
  margin-right: 45px;
  .showList {
    padding: 15px 15px;
  }
  .title-header {
    background: ${(props) => props.headerColor};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 12px;
    .title-text {
      color: white;
    }
    .items-count {
      color: ${(props) => props.headerColor};
      padding: 0 7px 0 7px;
      background: white;
      border-radius: 4px;
    }
  }
`;

const TaskColumnStyles = styled.div`
  margin: 8px;
  display: flex;
  width: 100%;
  min-height: 80vh;
`;

const headerColorMapping = {
  Open: "orange",
  Overdue: "yellow",
  Resolved: "blue",
  Closed: "green",
};

const Wrapper = styled.div`
  height: 100vh;
`;

const SearchContainer = styled.div`
  margin-top: 23px;
  right: 0;
  width: 250px;
  margin-left: 30px;
`;

const SearchInput = styled.input`
  padding: 8px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 16px;
  width: 100%;
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

const KanbanBoard = () => {
  const [columns, setColumns] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const filteredColumns = Object.fromEntries(
    Object.entries(columns || {}).map(([columnId, column]) => [
      columnId,
      {
        ...column,
        items: column.items.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      },
    ])
  );

  const fetchColumns = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/kanban/items");
      const data = response.data;
      setColumns(data);
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  }, []);

  useEffect(() => {
    fetchColumns();
  }, [fetchColumns]);

  const onDragEnd = async (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
  
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
  
    const updatedColumns = {
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    };

    setColumns(updatedColumns);
  
    try {
      await axios.put(`http://localhost:8080/kanban/items/${removed.id}`, {
        type: destColumn.title,
      });
    } catch (error) {
      console.error("Error updating item status:", error);
    }
  };


  return (
    <Wrapper>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search items by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>
      <ModalButton onClick={openModal}>Add New Item</ModalButton>
      <CreateItemForm
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        refreshData={fetchColumns}
      />
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        <Container>
          <TaskColumnStyles>
            {Object.entries(filteredColumns).map(([columnId, column]) => {
              const headerColor = headerColorMapping[column.title] || "#f3f3f3";
              return (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided) => (
                    <TaskList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      headerColor={headerColor}
                    >
                      <div className="title-header">
                        <span className="title-text">{column.title}</span>
                        <span className="items-count">
                          {column.items.length}
                        </span>
                      </div>
                      <div className="showList">
                        {column.items.map((item, index) => (
                          <Column key={item.id} item={item} index={index} />
                        ))}
                      </div>
                      {provided.placeholder}
                    </TaskList>
                  )}
                </Droppable>
              );
            })}
          </TaskColumnStyles>
        </Container>
      </DragDropContext>
    </Wrapper>
  );
};

export default KanbanBoard;
