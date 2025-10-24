import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
 const TODO_LIST=[
        {
            id:1,
            task:"Learn",
            done:false,
            createdAt: new Date().toISOString(),
            priority:"high",
            emoji: "📚",
        },
        {
            id:2,
            task:"Build",
            done:true,
            createdAt: new Date().toISOString(),
            priority:"medium",
            emoji: "🛠️",
        },
        {
            id:3,
            task:"Ship",
            done:false,
            createdAt: new Date().toISOString(),
            priority:"low",
            emoji: "🚢",
        },
        {
            id:4,
            task:"Repeat",
            done:false,
            createdAt: new Date().toISOString(),
            priority:"high",
            emoji: "🔁"
            ,
        }
    ]
app.get("/health",(req,res)=>{
res.json({
    success:true,
    message:"server is healthy"

});
});


app.get("/todos/search", (req, res) => {
    const { task, priority } = req.query;
    if (!task || !priority) {
        return res.status(400).json({
            success: false,
            message: "Missing query parameters 'task' or 'priority'"
            ,
        });
    }
    const filteredTodos = TODO_LIST.filter(
        (t) => t.task.toLowerCase().includes(task.toLowerCase()) && t.priority === priority     
    );
    res.json({
        success: true,
        data: filteredTodos,
        message: "search results",
    });
})

app.get("/todos/:id",(req,res)=>{
        const id = parseInt(req.params.id);
        const todo = TODO_LIST.find((t)=> t.id === id);
        if(todo){
            res.json({
                success:true,
                data:todo,
                message:"todos item fetched successfully"
            })
        }else{
            res.json({
                success:false,
                message:"not found"
            })
        }
});

app.get('/todos',(req,res)=>{
    res.json ({
        message: "Welcome to Todo API",
        data: TODO_LIST
    })
})

app.post('/todos',(req,res)=>{
   
const{task,priority,emoji}=req.body;


const newTodo={
    id: TODO_LIST.length + 1,   
    task: task,
    done: false,
    createdAt: new Date().toISOString(),
    priority: priority ,
    emoji: emoji,
}

TODO_LIST.push(newTodo);

   
    res.status(201).json({
        success:true,
        message: "Todo created successfully",
        data: TODO_LIST,
    });
});

app.delete("/todos/delete/:id",(req,res)=>{
    const id=req.params.id;
    const index=TODO_LIST.findIndex((t)=>t.id==id);
    if(index !== -1){
        TODO_LIST.splice(index,1);
        res.json({
            success:true,
            message:"Todo deleted successfully",
            data:TODO_LIST,
        });
    }else{
        res.status(404).json({
            success:false,  
            message:"Todo not found",
        });
    }
}); 


app.put("/todos/update/:id",(req,res)=>{
    const id=req.params.id;
    const {task,priority,emoji,done}=req.body;
    const todo=TODO_LIST.find((t)=>t.id==id);
    if(todo){
        todo.task=task;
        todo.priority=priority;
        todo.emoji=emoji;
        todo.done=done;
        res.json({
            success:true,
            message:"Todo updated successfully",
            data:TODO_LIST,
        });
    }else{
        res.status(404).json({
            success:false,
            message:"Todo not found",
        });
    }
});
app.patch("/todos/mark-done/:id",(req,res)=>{
    const id=req.params.id;
    const todo=TODO_LIST.find((t)=>t.id==id);
    if(todo){
        todo.done=true;
        res.json({
            success:true,
            message:"Todo marked as done",
            data:TODO_LIST,
        });
    }else{
        res.status(404).json({
            success:false,
            message:"Todo not found",
        });
    }
});
app.patch("/todos/:id/status",(req,res)=>{
    const id = parseInt(req.params.id);
    const { done } = req.body;
    const todo = TODO_LIST.find((t) => t.id === id);
    if (!todo) {
        return res.status(404).json({
            success: false,
            message: "Todo not found",
        });
    }
    if (typeof done === "boolean") {
        todo.done = done;
    } else {
        // toggle if no explicit boolean provided
        todo.done = !todo.done;
    }
    res.json({
        success: true,
        message: "Todo status updated",
        data: TODO_LIST,
    });
});
const PORT=process.env.PORT || 5003;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});