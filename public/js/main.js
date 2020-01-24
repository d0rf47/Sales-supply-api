/********************************************************************************* 
 * * WEB422 – Assignment 2 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  * No part of this assignment has been copied manually or electronically from any other source 
 * * (including web sites) or distributed to other students. * 
 * * Name: Michael Falconi Student ID: 143152189 Date: Jan 25 2020 * 
 * * ********************************************************************************/
const items = [];
var total=0;
var item;
let page  = 0;
const perPage = 10;
const saleTableTemplate = _.template(`
    <% _.forEach(items, function(item){ %>
        <tr data-id=<%-item._id %>>
            <td> <%- item.customer.email %> </td>
            <td> <%- item.storeLocation %> </td>
            <td> <%- item.items.length %> </td>
            <td> <%- moment.utc(item.saleDate).local().format('LLLL') %> </td>
        </tr>
    <% }); %>
`);
const saleModelBodyTemplate = _.template(`
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h4> Sale: <%- item._id %> </h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>              
         </div>
        
         <div class="modal-body">
         <h5> Customer </h5>
            <strong> E-mail:  </strong> <%-item.customer.email %>
            <br>
            <strong>age: </strong> <%- item.customer.age %> 
            <br>
            <strong>Satisfaction: </strong>  <%-item.customer.satisfaction %> / 5
            <br>
            <br>
            <h4>Items $<%- total %> </h4>
                <table class ="table">
                    <thead>
                        <tr>
                            <th> Product Name </th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <% _.forEach(item.items, function(saleItem){ %>
                            <tr>
                                <td> <%- saleItem.name %>  </td>
                                <td> <%- saleItem.quantity %> </td>
                                <td> $<%- saleItem.price %> </td>
                            <tr>
                        <% }); %>
                    </tbody>
                </table>
            </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>              
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    
            
`)

$(function()
{
    console.log("DOM ready");
    page = $("#page").html();    
    getData();
    $("#data-table tbody").on("click","tr", function(e){
        let id = ($(this).attr("data-id"));                    
        console.log(id);        
        item = _.find(items, function(found)
        {
            if(found._id == id)
            {
                return found;
            }            
            
        })
        _.forEach(item.items, function(i){
            total += Number(i.price) * Number(i.quantity);
            
        });
        total = _.round(total,2);
        console.log(total);
        console.log(item)
        $("#itemModal").html(saleModelBodyTemplate(item))
        $("#itemModal").modal("show")
    });
    
})

function getData()
{
    items.length=0;
    $("#page").text(page)
    $.getJSON(`https://sales-supplies-api.herokuapp.com/api/sales/?page=${page}&perPage=${perPage}`, function(data)
    {        
        $.each(data, function(key, val)
        {
            items.push(val);
            console.log(val);
        });                        
        $("tbody").html(saleTableTemplate(items))            
    })          
}
$(function()
{
    console.log(window.location.href);
    nextPage();
    prevPage();
})

function nextPage()
{    
    $("#page").attr("href", window.location.href)
    $("#nextPage").on("click", function(){
        page++;
        getData();        
    })    
}

function prevPage()
{    
    $("#page").attr("href", window.location.href)
    $("#prevPage").on("click", function(){
        page--;
        getData();        
    })    
}