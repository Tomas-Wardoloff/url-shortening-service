import { Response } from "express";

import UrlService from "../services/urlService.js";
import { AuthRequest } from "../middlewares/authenticationMiddleware.js";

class UrlController {
  private urlService = new UrlService();

  public shortenUrl = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const user = request.user;
    const { url, description, customAlias } = request.body;

    if (!url) {
      response.status(400).json({ error: "No URL provided" });
      return;
    }

    if (customAlias) {
      if (customAlias.length > 16) {
        response
          .status(400)
          .json({ error: "Custom alias must be less than 16 characters" });
        return;
      }

      if (customAlias.length < 4) {
        response
          .status(400)
          .json({ error: "Custom alias must be at least 4 characters" });
        return;
      }

      if (customAlias.includes(" ")) {
        response
          .status(400)
          .json({ error: "Custom alias must not contain spaces" });
        return;
      }
    }

    try {
      const data = await this.urlService.shortenUrl(
        user.id,
        url,
        description,
        customAlias
      );
      response.status(201).json({ message: "URL shortened", data: data });
      return;
    } catch (error: any) {
      if (error.message === "Invalid URL")
        response.status(400).json({ error: error.message });
      else if (error.message === "Short code already exists")
        response.status(400).json({ error: error.message });
      else response.status(500).json({ error: error.message });
      return;
    }
  };

  public redirectUrl = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const { shortCode } = request.params;

    try {
      const url = await this.urlService.redirectUrl(shortCode);
      response.status(301).redirect(url);
      return;
    } catch (error: any) {
      if (error.message === "URL not found")
        response.status(404).json({ error: error.message });
      response.status(500).json({ error: error.message });
      return;
    }
  };

  public updateUrl = async (
    request: AuthRequest,
    response: Response
  ): Promise<any> => {
    // To update the original url and the description
    const user = request.user;
    const { shortCode } = request.params;
    const { url, description } = request.body;

    if (!url && !description) {
      response.status(400).json({ error: "No data provided" });
      return;
    }

    try {
      const data = await this.urlService.updateUrl(
        user.id,
        shortCode,
        url,
        description
      );
      response.status(200).json({ message: "URL updated", data: data });
      return;
    } catch (error: any) {
      if (error.mmessage === "URL not found")
        response.status(404).json({ error: error.message });
      else if (error.message === "Invalid URL")
        response.status(400).json({ error: error.message });
      else if (error.message === "Action not authorized")
        response.status(403).json({ error: error.message });
      else response.status(500).json({ error: error.message });
      return;
    }
  };

  public deleteUrl = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const user = request.user;
    const { shortCode } = request.params;

    try {
      await this.urlService.deleteUrl(user.id, shortCode);
      response.status(204).json({ message: "URL deleted" });
      return;
    } catch (error: any) {
      if (error.message === "URL not found")
        response.status(404).json({ error: error.message });
      if (error.message === "Action not authorized")
        response.status(403).json({ error: error.message });
      else response.status(500).json({ error: error.message });
      return;
    }
  };

  public getUserUrls = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const user = request.user;

    try {
      const data = await this.urlService.getUserUrls(user.id);
      response.status(200).json({ message: "All user urls", data: data });
      return;
    } catch (error: any) {
      response.status(500).json({ error: error.message });
      return;
    }
  };

  public asignTagToUrl = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const user = request.user;
    const { shortCode, tagId } = request.params;

    if (isNaN(parseInt(tagId))) {
      response.status(400).json({ error: "Invalid tag id" });
      return;
    }

    try {
      await this.urlService.asignTagToUrl(user.id, shortCode, parseInt(tagId));
      response.status(200).json({ message: "Tag assigned to URL" });
      return;
    } catch (error: any) {
      if (
        error.message === "URL not found" ||
        error.message === "Tag not found" ||
        error.message === "Tag already assigned to this URL"
      )
        response.status(404).json({ error: error.message });
      if (error.message === "Action not authorized")
        response.status(403).json({ error: error.message });
      else response.status(500).json({ error: error.message });
      return;
    }
  };
}

export default UrlController;
