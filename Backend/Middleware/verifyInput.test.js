import {validateUserLogin, validateUserRegistration} from "./verifyInput";

describe("User login validation test", ()=>{
    it("Passes if correct input format is entered", () => {
        const req={body: {

            // Expect an error if dummy data is entered wrongly
                Email: "valid_email@example.com",
                Password: "password123"
            }
        };
        const res={};
        const next=jest.fn();

        validateUserLogin(req, res, next);
    });


    
    it("Should check if the validation is working", ()=>{
        const req={body: {

                // Dummy data entries should raise an error if coreectly  entered
                Email: "",
                Password: ""
            }};

        const res={
            status: jest.fn(()=>res),
            json: jest.fn()
        };
        const next=jest.fn();

        //Call fxn and pass the params
        validateUserLogin(req, res, next);
        // Expect an error if correct dummy data is entered
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "All fields are required"
        });
    });
    it("Should check if RegEX expression is working", ()=>{
        const req={body: {
                Email: "invalid_email@gmail.k", // Provide wrong email
                Password: "password123" // provide wrong 
            }
        };
        const res={
            status: jest.fn(()=>res),
            json: jest.fn()
        };
        const next=jest.fn();

        validateUserLogin(req, res, next); 
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid email format"
        });
    });
});

