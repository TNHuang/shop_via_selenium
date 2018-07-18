# shop_via_selenium
allow user to shop item via selenium, useful for auction sniping or bulk purchase at e-commerce site.

to configure how many shoppers => change numberOfUsers in line 7;
to configure type of item to shop for => change itemName in the defaultOption in line 20;
to configure the checkout process => modify the actions array in generateActionConfig function.

each "action" contain a css selector and a type of action.

so for example, I want to click the purchase button, the button has a text of "purchase"
my action object would be 
```
{
  identifier: By.linkText("purchase"),
  action: "click"
}
```

another example, let's say I want to fill out my shipping address line1, the input element has an id of "shipping_address",
and your address is "123 baker street", youyour action would be
```
{
  identifier: By.css("#shipping_address"),
  action: "input"
  value: "123 baker street"
}
```
