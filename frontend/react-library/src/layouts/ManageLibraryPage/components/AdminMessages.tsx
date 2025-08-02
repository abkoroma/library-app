import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import Spinner from "../../utils/Spinner";
import Pagination from "../../utils/Pagination";
import AdminMessage from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";
import { useAuth0 } from "@auth0/auth0-react";

export default function AdminMessages() {

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const [isLoadinngMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [btnSubmit, setBtnSubmit] = useState(false);


    useEffect(() => {
        const fetchUserMessages = async () => {
            if (isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/messages/search/findByClosed/?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const accessToken = await getAccessTokenSilently();
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    }
                };
                const messagesResponse = await fetch(url, requestOptions);
                if (!messagesResponse.ok) {
                    throw new Error('Something went wrong');
                }
                const messagesResponseJson = await messagesResponse.json();

                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);
        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.messages);
        })
        window.scrollTo(0, 0);
    }, [currentPage, getAccessTokenSilently, isAuthenticated, messagesPerPage]);

    if (isLoadinngMessages) {
        return (
            <Spinner />
        );
    }


    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    async function submitResponseToQuestion(id: number, response: string) {
        const url = `${process.env.REACT_APP_API}/messages/secure/admin/message`;
        const accessToken = await getAccessTokenSilently();
        if (isAuthenticated && id !== null && response !== '') {
            const messageAdminRequestModel: AdminMessageRequest = new AdminMessageRequest(id, response);
            const requestionOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageAdminRequestModel)
            };

            const messageResponseRequestModelResponse = await fetch(url, requestionOptions);
            if (!messageResponseRequestModelResponse.ok) {
                throw new Error('Something went wrong');
            }
            setBtnSubmit(!btnSubmit);
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="mt-3">
            {messages.length > 0 ?
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                        <AdminMessage 
                            message={message} 
                            key={message.id} 
                            submitResponseToQuestions={submitResponseToQuestion} />
                    ))}
                </>
                :
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && 
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    paginate={paginate} 
                />
            }
        </div>
    );
}