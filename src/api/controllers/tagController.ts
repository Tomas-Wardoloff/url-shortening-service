import { Response } from "express";

import TagService from "../services/tagService.js";
import { AuthRequest } from "../middlewares/authenticationMiddleware.js";

class TagController {
  private tagService = new TagService();

  public createTag = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const user = request.user;
    const { name } = request.body;

    if (!name) {
      response.status(400).json({ message: "Name is required" });
      return;
    }

    if (name.length > 20) {
      response
        .status(400)
        .json({ error: "Tag name must be less than 20 characters" });
      return;
    }

    try {
      const data = await this.tagService.createTag(user.id, name);
      response.status(201).json({ message: "Tag created", data: data });
      return;
    } catch (error: any) {
      if (error.message === "Tag already exists")
        response.status(409).json({ error: error.message });
      else response.status(500).json({ error: error.message });
      return;
    }
  };

  public getUserTags = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const user = request.user;

    try {
      const data = await this.tagService.getUserTags(user.id);
      response.status(202).json({ message: "All user tags", data: data });
      return;
    } catch (error: any) {
      response.status(500).json({ error: error.message });
      return;
    }
  };

  public deleteTag = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const user = request.user;
    const tagId = request.params.tagId;

    if (isNaN(parseInt(tagId))) {
      response.status(400).json({ error: "Invalid tag id" });
      return;
    }

    try {
      await this.tagService.deleteTag(user.id, parseInt(tagId));
      response.status(204).json({ message: "Tag deleted" });
      return;
    } catch (error: any) {
      if (error.message === "Tag not found")
        response.status(404).json({ error: error.message });
      else response.status(500).json({ error: error.message });
      return;
    }
  };
}

export default TagController;
