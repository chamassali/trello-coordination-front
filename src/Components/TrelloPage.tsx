import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';

// Define the PopperState interface
interface PopperState {
    open: boolean;
    anchorEl: HTMLElement | null;
    placement: PopperPlacementType | undefined;
    content: string;
}

interface CardData {
    _id: string;
    title: string;
    desc: string;
    priority: number;
    state: string;
    __v: number;
}

const TrelloPage: React.FC = () => {

    const handleFormSubmit = (index: number) => () => {
        const formData = formStates[index];

        // Check if the priority is a valid value
        if (['low', 'medium', 'high'].includes(formData.priority)) {
            // Make a POST request to the API to add a new task
            fetch('https://trello-0xr7.onrender.com/api/cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then((response) => response.json())
                .then((newTask: CardData) => {
                    setApiData((prevApiData) => [...prevApiData, newTask]);
                })
                .catch((error) => {
                    console.error('Error adding a task:', error);
                });

            // Reset the form data for the specific popup
            const updatedFormStates = [...formStates];
            updatedFormStates[index] = { ...initialFormState };
            setFormStates(updatedFormStates);
        } else {
            // Handle validation error
            console.error('Invalid priority value');
            // You can display an error message to the user if needed
        }
    };

    const handleDeleteTask = (taskId: string) => {
        // Send a DELETE request to the API to delete the task
        fetch(`https://trello-0xr7.onrender.com/api/cards/${taskId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    // If the deletion was successful, update the state to remove the task
                    setApiData((prevApiData) => prevApiData.filter((task) => task._id !== taskId));
                } else {
                    console.error('Error deleting task:', response.status);
                }
            })
            .catch((error) => {
                console.error('Error deleting task:', error);
            });
    };


    const [apiData, setApiData] = useState<CardData[]>([]);

    useEffect(() => {
        fetch('https://trello-0xr7.onrender.com/api/cards')
            .then((response) => response.json())
            .then((data: CardData[]) => {
                setApiData(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const todoCards: CardData[] = apiData.filter((card) => card.state === 'todo');
    const inProgressCards: CardData[] = apiData.filter((card) => card.state === 'inprogress');
    const doneCards: CardData[] = apiData.filter((card) => card.state === 'done');





    const handleDragStart = (event: React.DragEvent, cardId: string, sourceColumnId: string) => {
        event.dataTransfer.setData("text/plain", cardId);
        event.dataTransfer.setData("sourceColumnId", sourceColumnId);
    };




    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent, cardId: string, sourceColumnId: string, targetColumnId: string) => {
        event.preventDefault();

        // Find the dragged card by its card ID and source column
        const draggedCardIndex = apiData.findIndex((card) => card._id === cardId && card.state === sourceColumnId);

        if (draggedCardIndex !== -1) {
            const updatedApiData = [...apiData];
            const draggedCard = updatedApiData[draggedCardIndex];

            // Determine the index where the card will be placed in the new column
            const targetIndex = 0; // You should calculate this based on your specific logic

            // Move the card to the new column
            draggedCard.state = targetColumnId;
            updatedApiData.splice(draggedCardIndex, 1); // Remove from the source column
            updatedApiData.splice(targetIndex, 0, draggedCard); // Add to the new column

            setApiData(updatedApiData);
        }
    };














    const getPriorityClass = (priority: string | number) => {
        switch (priority) {
            case "low":
                return "low-priority";
            case "medium":
                return "medium-priority";
            case "high":
                return "high-priority";
            default:
                return "";
        }
    };











    const handleSelectChange = (index: number, field: string, event: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedFormStates = [...formStates];
        updatedFormStates[index] = {
            ...updatedFormStates[index],
            [field]: event.target.value,
        };
        setFormStates(updatedFormStates);
    };

    const [popups, setPopups] = useState<PopperState[]>([
        { open: false, anchorEl: null, placement: undefined, content: 'Content for To Do' },
        { open: false, anchorEl: null, placement: undefined, content: 'Content for In Progress' },
        { open: false, anchorEl: null, placement: undefined, content: 'Content for Done' },
    ]);

    const initialFormState = {
        title: '',
        desc: '',
        priority: '',
        state: '',
    };

    const [formStates, setFormStates] = useState<Array<typeof initialFormState>>([
        { ...initialFormState },
        { ...initialFormState },
        { ...initialFormState },
    ]);

    const handleInputChange = (index: number, field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const updatedFormStates = [...formStates];
        updatedFormStates[index] = {
            ...updatedFormStates[index],
            [field]: event.target.value,
        };
        setFormStates(updatedFormStates);
    };

    const handlePopupClick = (index: number) => (newPlacement: PopperPlacementType) => (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setPopups((prevPopups) => {
            const updatedPopups = prevPopups.map((popup, i) => {
                if (i === index) {
                    return {
                        ...popup,
                        anchorEl: event.currentTarget,
                        open: !popup.open || popup.placement !== newPlacement,
                        placement: newPlacement,
                    };
                }
                return popup;
            });
            return updatedPopups;
        });
    };

    // const handleFormSubmit = (index: number) => () => {
    //     // Handle form submission for the popup at the specified index (0, 1, or 2).
    //     // You can access the form data from the formStates state.
    //     console.log('Form submitted for popup at index', index, formStates[index]);
    //     // Reset the form data for the specific popup
    //     const updatedFormStates = [...formStates];
    //     updatedFormStates[index] = { ...initialFormState };
    //     setFormStates(updatedFormStates);
    // };


    return (
        <div className="trello-page-container">
            <h1 className="page-title mb-6">Trello Page</h1>

            <div className="columns-container">
                {popups.map((popup, index) => (
                    <div className="columns-card" key={index} id={`column-${index}`} draggable="true" onDrop={(event) => handleDrop(event, '', '', 'todo')} onDragOver={(event) => handleDragOver(event)}>
                        <Card className="" sx={{ minWidth: 275 }}>
                            <CardContent>
                                {index === 0
                                    ?
                                    <>
                                        <h2>
                                            To Do
                                        </h2>
                                        {todoCards.map((card, index) => (
                                            <div className="trello-card" key={index}
                                                draggable="true"
                                                onDragStart={(event) => handleDragStart(event, card._id, card.state)}
                                                onDragOver={(event) => handleDragOver(event)}
                                                onDrop={(event) => handleDrop(event, card._id, card.state, 'todo')}>

                                                <span className={`card-priority ${getPriorityClass(card.priority)}`}></span>

                                                <h4>{card.title}</h4>
                                                <p>{card.desc}</p>
                                                <Button
                                                    variant="outlined"
                                                    className='delete-button'
                                                    color="primary"
                                                    onClick={() => handleDeleteTask(card._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        ))}
                                    </>


                                    : index === 1
                                        ?
                                        <>
                                            <h2>
                                                In Progress
                                            </h2>
                                            {inProgressCards.map((card, index) => (
                                                <div className="trello-card" key={index}
                                                    draggable="true"
                                                    onDragStart={(event) => handleDragStart(event, card._id, card.state)}
                                                    onDragOver={(event) => handleDragOver(event)}
                                                    onDrop={(event) => handleDrop(event, card._id, card.state, 'inprogress')}>

                                                    <span className={`card-priority ${getPriorityClass(card.priority)}`}></span>
                                                    <h4>{card.title}</h4>
                                                    <p>{card.desc}</p>

                                                    <Button
                                                        variant="outlined"
                                                        className='delete-button'
                                                        color="primary"
                                                        onClick={() => handleDeleteTask(card._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            ))}
                                        </>
                                        :
                                        <>
                                            <h2>
                                                Done
                                            </h2>
                                            {doneCards.map((card, index) => (
                                                <div className="trello-card" key={index}
                                                    draggable="true"
                                                    onDragStart={(event) => handleDragStart(event, card._id, card.state)}
                                                    onDragOver={(event) => handleDragOver(event)}
                                                    onDrop={(event) => handleDrop(event, card._id, card.state, 'done')}>

                                                    <span className={`card-priority ${getPriorityClass(card.priority)}`}></span>
                                                    <h4>{card.title}</h4>
                                                    <p>{card.desc}</p>

                                                    <Button
                                                        variant="outlined"
                                                        className='delete-button'
                                                        color="primary"
                                                        onClick={() => handleDeleteTask(card._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            ))}
                                        </>
                                }


                            </CardContent>
                            <CardActions>
                                <Button
                                    aria-describedby={popup.open ? 'spring-popper' : undefined}
                                    size="small"
                                    type="button"
                                    onClick={handlePopupClick(index)('bottom-end')}
                                >
                                    Add task
                                </Button>
                                <Popper
                                    open={popup.open}
                                    anchorEl={popup.anchorEl}
                                    placement={popup.placement}
                                    transition
                                >
                                    {({ TransitionProps }) => (
                                        <Fade {...TransitionProps} timeout={350}>
                                            <Paper>
                                                <form className="add-task-form">
                                                    <div className="input-container">
                                                        <label>Title:</label>
                                                        <input
                                                            type="text"
                                                            value={formStates[index].title}
                                                            onChange={handleInputChange(index, 'title')}
                                                        />
                                                    </div>
                                                    <div className="input-container">
                                                        <label>Description:</label>
                                                        <input
                                                            type="text"
                                                            value={formStates[index].desc} // Should be 'desc'
                                                            onChange={handleInputChange(index, 'desc')} // Should be 'desc'
                                                        />
                                                    </div>
                                                    <div className="input-container">
                                                        <label>Priority:</label>
                                                        <select
                                                            value={formStates[index].priority}
                                                            onChange={(event) =>
                                                                handleSelectChange(index, 'priority', event)
                                                            }
                                                        >
                                                            <option value="low">Low</option>
                                                            <option value="medium">Medium</option>
                                                            <option value="high">High</option>
                                                        </select>
                                                    </div>
                                                    <div className="input-container">
                                                        <label>State:</label>
                                                        <select
                                                            value={formStates[index].state}
                                                            onChange={(event) =>
                                                                handleSelectChange(index, 'state', event)
                                                            }
                                                        >
                                                            <option value="todo">To Do</option>
                                                            <option value="inprogress">In Progress</option>
                                                            <option value="done">Done</option>
                                                        </select>
                                                    </div>

                                                    <Button
                                                        onClick={handleFormSubmit(index)}
                                                        variant="contained"
                                                        color="primary"
                                                    >
                                                        Submit
                                                    </Button>
                                                </form>
                                            </Paper>
                                        </Fade>
                                    )}
                                </Popper>
                            </CardActions>
                        </Card>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default TrelloPage;