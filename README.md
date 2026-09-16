# Mealie Demo

This demo shows how to run Mealie, a self-hosted recipe manager and meal planner on Codesphere as a Managed Container. 
It also contains a small Dashboard application within `./dashboard` that demonstrates how to use Codesphere Reactives and Managed Containers in parallel in a single Codesphere Landscape.

## Steps 

`ci.base.yml` contains a basic Mealie deployment using SQLite as a DB backend. 

To run `ci.with-dashboard.yml`, start Mealie first through the `ci.base.yml`, run the setup and create an API Token for the Dashboard. 
Then switch to the `with-dashboard` profile and add a API Token as a Secret when prompted. 