Let's forget at everything at first, before we working on the invoices.

- We know the supabase data structure.

It looks like this:

invoice {
    id: string (uuid) auto generated
    user_id: who owns this invoice ? It is needed to send a invoice to a client,we need the freelancer name

    client_id: who do we send the invoice to? , we need the client name

    total: total amount to be added in the invoice.

    status: status of the invoices. we can have enum of status like draft sent paid 

    due_date: we need to put the date when shall till i need this payment

    createdAt timestamp - auto added when the invoice is created.

    invoice_number: we name the invoice id. 

}

We need to know how a invoice bill look like

It is a collection of invoice item with client_name, total, and other fields like due date and stuffs right?

Then we also need to create a InvoiceItems.

InvoiceItems {
    id - unique auto generated
    invoice_id = one to many relation with invoice items (Reference of which invoice do items belongs to)

    
    description: description of the invoice item
    amount: amount of a invoice item

}

Creating a invoice means also creating invoice items. Invoice is a collection of invoice items right?

So let's focus on how the data of the form would look like?

when creating a invoice, we dont need much input from the user. user_id is added from the currentlty login user, we need client_id, project_id (comes from the stores)

we need due_date, total to be created from the items. invoice number to be created too.


so how do the user Input form look like?

User select the due_date of the invoice.

then user enters the items they want to charge for - the invoice items, we know the invoice is a collection fo invoice items. so invoice items = [
    {
        description: 'Description of the task completed'
        amount: 'Amount for the task'
    }
]

so when creating a invoice, we need to pass these datas.


Now let's think of the ui.
The form at first dont know about how much is there in invoice items. 

It comes from the user. User can add any number of form items.

Previously in RHF we used to know the exact fields and we would know it will have the exact data.


But in this case, the react hook form dont know about how would the data would look like. It depends on user actions. we will have:

due_date:
items : [
    {item1 - title and amount},
    {item2 - title and amount}
]




