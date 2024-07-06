package com.library.springbootlibrary.service;

import com.library.springbootlibrary.dao.MessageRepositoryDAO;
import com.library.springbootlibrary.entity.Message;
import com.library.springbootlibrary.requestmodels.AdminQuestionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class MessagesService {

    private MessageRepositoryDAO messageRepositoryDAO;

    @Autowired
    public MessagesService(MessageRepositoryDAO messageRepositoryDAO) {
        this.messageRepositoryDAO = messageRepositoryDAO;
    }

    public void postMessage(Message messageRequest, String userEmail) {
        Message message = new Message(messageRequest.getTitle(), messageRequest.getQuestion());
        message.setUserEmail(userEmail);
        messageRepositoryDAO.save(message);
    }

    public void putMessage(AdminQuestionRequest adminQuestionRequest, String userEmail) throws Exception{
        Optional<Message> message = messageRepositoryDAO.findById(adminQuestionRequest.getId());

        if (!message.isPresent()) {
            throw new Exception("Message not found");
        }

        message.get().setAdminEmail(userEmail);
        message.get().setResponse(adminQuestionRequest.getResponse());
        message.get().setClosed(true);
        messageRepositoryDAO.save(message.get());
    }
}
