import { Router } from "express";
import { TodosController } from "./controller";

export class TodosRoutes {
  static get routes(): Router {
    const router = Router();
    const todosController = new TodosController();

    router.get("/", todosController.getTodos);
    router.get("/:id", todosController.getTodo);
    router.post("/", todosController.createTodo);
    router.put("/", todosController.updateTodo);
    router.delete("/:id", todosController.deleteTodo);

    return router;
  }
}
