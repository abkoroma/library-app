/*package com.library.springbootlibrary.service;

import com.library.springbootlibrary.dao.PaymentRepositoryDAO;
import com.library.springbootlibrary.entity.Payment;
import com.library.springbootlibrary.requestmodels.PaymentInfoRequest;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PaymentService {

    private PaymentRepositoryDAO paymentRepositoryDAO;

    @Autowired
    public PaymentService(PaymentRepositoryDAO paymentRepositoryDAO,
                          @Value("${stripe.key.secret}") String secretKey) {
        this.paymentRepositoryDAO = paymentRepositoryDAO;
        Stripe.apiKey = secretKey;
    }

    public PaymentIntent createPaymentIntent(PaymentInfoRequest paymentInfoRequest) throws Exception {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfoRequest.getAmount());
        params.put("currency", paymentInfoRequest.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);

        return PaymentIntent.create(params);
    }

    public ResponseEntity<String> stripePayment(String userEmail) throws Exception {
        Payment payment = paymentRepositoryDAO.findByUserEmail(userEmail);

        if (payment == null) {
            throw new Exception("Payment information is missing");
        }
        payment.setAmount((long) 00.00);
        paymentRepositoryDAO.save(payment);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
 */
