import { Fragment, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminMessages from "./components/AdminMessages";
import AddNewBook from "./components/AddNewBook";
import ChangeQuantityOfBooks from "./components/ChangeQuantityOfBooks";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from "../utils/Spinner";

export default function ManageLibraryPage() {

    const { getIdTokenClaims } = useAuth0();

    const [roles, setRoles] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(true);

    const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] = useState(false);
    const [messagesClick, setMessagesClick] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            const claims = await getIdTokenClaims();
            const fetchedRoles = claims?.['https://luv2code-react-library.com/roles'] || [];
            setRoles(fetchedRoles);
            setLoading(false);
        }

        fetchBooks();
    }, [getIdTokenClaims]);

    function addBookClickFunction() {
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(false);
    }

    function changeQuantityOfBooksClickFunction() {
        setChangeQuantityOfBooksClick(true);
        setMessagesClick(false) ;  
    }

    function messagesClickFunction() {
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(true) ;  
    }

    if (loading) {
        return <Spinner />
    }

    if (!roles?.includes('admin')) {
        return <Navigate to="/home" />
    }


    return (
        <div className="container">
            <div className="mt-5">
                <h3>Manage Library</h3>
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button
                            onClick={addBookClickFunction} 
                            className="nav-link active" role="tab" 
                            id="nav-add-book-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-add-book" type="button"
                            aria-controls="nav-add-book" aria-selected="false"
                        >
                            Add new book
                        </button>
                        <button
                            onClick={changeQuantityOfBooksClickFunction} 
                            className="nav-link" role="tab" 
                            id="nav-quantity-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-quantity" type="button"
                            aria-controls="nav-quantity" aria-selected="true"
                        >
                            Change Quantity
                        </button>
                        <button 
                            onClick={messagesClickFunction} 
                            className="nav-link" role="tab" 
                            id="nav-messages-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-messages" type="button"
                            aria-controls="nav-messages" aria-selected="false"
                        >
                            Messages
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade shadow active" 
                        id="nav-add-book" role="tabpanel" 
                        aria-labelledby="nav-add-book-tab"
                    >
                        <AddNewBook />
                    </div>
                    <div className="tab-pane fade" id="nav-quantity"
                        role="tabpanel" aria-labelledby="nav-quantity-tab"
                    >
                        {changeQuantityOfBooksClick ? 
                            <ChangeQuantityOfBooks /> : 
                            <Fragment></Fragment>
                        }
                    </div>
                    <div className="tab-pane fade" id="nav-messages"
                        role="tabpanel" aria-labelledby="nav-messages-tab"
                    >
                        {messagesClick ? 
                            <AdminMessages /> : 
                            <Fragment></Fragment>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}