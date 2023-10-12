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
        description: '',
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

    const handleFormSubmit = (index: number) => () => {
        // Handle form submission for the popup at the specified index (0, 1, or 2).
        // You can access the form data from the formStates state.
        console.log('Form submitted for popup at index', index, formStates[index]);
        // Reset the form data for the specific popup
        const updatedFormStates = [...formStates];
        updatedFormStates[index] = { ...initialFormState };
        setFormStates(updatedFormStates);
    };

    return (
        <div className="trello-page-container">
            <h1 className="page-title mb-6">Trello Page</h1>

            <div className="columns-container">
                {popups.map((popup, index) => (
                    <div className="columns-card" key={index}>
                        <Card className="" sx={{ minWidth: 275 }}>
                        <CardContent>
                            {index === 0
                                ?
                                <>
                                    {todoCards.map((card, index) => (
                                        <div className="card" key={index}>
                                            <h2>{card.title}</h2>
                                            <p>{card.desc}</p>
                                        </div>
                                    ))}
                                </>


                                : index === 1
                                    ?
                                    <>
                                        {inProgressCards.map((card, index) => (
                                            <div className="card" key={index}>
                                                <h2>{card.title}</h2>
                                                <p>{card.desc}</p>
                                            </div>
                                        ))}
                                    </>
                                    :
                                    <>
                                        {doneCards.map((card, index) => (
                                            <div className="card" key={index}>
                                                <h2>{card.title}</h2>
                                                <p>{card.desc}</p>
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
                                                        <textarea
                                                            value={formStates[index].description}
                                                            onChange={handleInputChange(index, 'description')}
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