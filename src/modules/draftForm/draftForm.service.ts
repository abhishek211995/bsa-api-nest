import { InjectRepository } from "@nestjs/typeorm";
import { NewDraftDto } from "src/modules/draftForm/draftForm.dto";
import { BreDraft } from "src/modules/draftForm/draftForm.entity";
import { Repository } from "typeorm";

export class DraftFormService {
  constructor(
    @InjectRepository(BreDraft)
    private readonly breDraftRepository: Repository<BreDraft>,
  ) {}

  public async createDraft(data: NewDraftDto) {
    try {
      const draft = this.breDraftRepository.create(data);
      await this.breDraftRepository.save(draft);
      return draft;
    } catch (error) {}
  }

  public async getDrafts(userId: number) {
    try {
      return this.breDraftRepository.find({ where: { user_id: userId } });
    } catch (error) {}
  }

  public async deleteDraft(id: number) {
    try {
      return this.breDraftRepository.delete({ id });
    } catch (error) {}
  }

  public async updateDraft(id: number, data: NewDraftDto) {
    try {
      return this.breDraftRepository.update(
        { id },
        { draft_type: data.draft_type, draft_values: data.draft_values },
      );
    } catch (error) {}
  }
}
