sequenceDiagram
    participant browser
    participant server


    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of browser: The request contains the note as JSON data containing both content and date: <br/> { content: "...", date: "..." }
    
    server-->>browser: 201 Created
    deactivate server
