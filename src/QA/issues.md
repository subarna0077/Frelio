## 15JUN

Issue 1 - If projects length is 0, client length is 0, in projects page, when creating the project, we have to choose the client to whom it belongs to, How to handle in this case?

Issue 2 - What is the use of the project code? Is it done manually in the professional freelance app? I havent known about it usage yet. But when I create, I have to manually put the project code, and it avoid the duplication of the project code, but how would the user know about it? How can we control this?


Issue 3- When setting the address in the client, there is a error, the error is once the user go to the business page, then click on the address check, then it is throwing error if we even get back to the individual section. even though we have not opted to choose business while adding client.

 ``` jsx
 {
    "billing_address": {
        "address_line_1": {
            "message": "Required",
            "type": "too_small",
            "ref": {
                "value": "",
                "_valueTracker": {}
            }
        },
        "city": {
            "message": "Required",
            "type": "too_small",
            "ref": {
                "value": "",
                "_valueTracker": {}
            }
        },
        "province_id": {
            "message": "Required",
            "type": "invalid_type"
        },
        "district_id": {
            "message": "Required",
            "type": "invalid_type"
        }
    }
}
```

Even if the user mistakely click the checkbox, the user should be insert the billing address anyhow to pass validation. FIx this.


Issue 4 - When creating the project, the due date is optional i guess. but it is showing error when creating , that we should provide the due date. Also the project adding modal is lacking the validation error. ()


Issue 5 = The client type selection is also lacking the validation error. (client modal)


Issue 6 - Since it is a milestone based project, the milestone is the source of truth - disable the editiable invoice items in the createInvoice form.

Issues it can create 
- Total contract amount is set based on the milestones


Issue 7 - Invoices marked as paid but the payment is not updated in the dashboard. (milestone status vs invoice status)










