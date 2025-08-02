import { useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { useAuth0 } from "@auth0/auth0-react";

export default function PostNewMessage() {

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    async function submitNewQuestion() {
        const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;
        const accessToken = await getAccessTokenSilently();
        if (isAuthenticated && title !== '' && question !== '') {
            const messageResponseRequestModel: MessageModel = new MessageModel(
                title, question
            );
            const requestionOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(messageResponseRequestModel)
            };
            const submitNewQuestionResponse = await fetch(url, requestionOptions);
            if (!submitNewQuestionResponse.ok) {
                throw new Error('Something went wrong');
            }
            setTitle('');
            setQuestion('');
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return(
        <div className="card mt-3">
            <div className="card-header">
                Ask question to Luv 2 Read Admin
            </div>
            <div className="card-body">
                <form method="POST">
                    {displayWarning && 
                        <div className="alert alert-danger" role="alert">
                            All fields must be filled out
                        </div>
                    }
                    {displaySuccess &&
                        <div className="alert alert-success" role="alert">
                            Question added successfully
                        </div>
                    }
                    <div className="mb-3"> 
                        <label className="form=label">
                            Title
                        </label>
                        <input type="text" className="form-control" 
                            id="exampleFormControlInput1" placeholder="Title"
                            onChange={e => setTitle(e.target.value)} value={title} 
                        />
                    </div>

                    <div>
                        <label className="form-label">
                            Question
                        </label>
                        <textarea className="form-control" 
                            id="exampleFormControlTextarea1" placeholder="Title"
                            onChange={e => setQuestion(e.target.value)} 
                            value={question} rows={3}
                        >
                        </textarea>
                    </div>
                    <div>
                        <button type="button" 
                            className="btn btn-primary mt-3"
                            onClick={submitNewQuestion}>
                            Sumbit Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}