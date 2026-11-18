import { Dialog } from "@rondevu/features/components/controlled-dialog";
import { sanitizeTimezone } from "@rondevu/lib/dayjs";
import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { HttpError } from "@rondevu/lib/http-error";
import { trpc } from "@rondevu/trpc/react";
import { Button } from "@rondevu/ui/components/button";
import { DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@rondevu/ui/components/dialog";
import { Form, InputField } from "@rondevu/ui/components/form";
import { showToast } from "@rondevu/ui/components/toast";
import { revalidateAvailabilityList } from "app/(use-page-wrapper)/(main-nav)/availability/actions";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function NewScheduleButton({
  name = "new-schedule",
  fromEventType,
}: {
  name?: string;
  fromEventType?: boolean;
}) {
  const router = useRouter();
  const { t } = useLocale();

  const form = useForm<{
    name: string;
  }>();
  const { register } = form;
  const utils = trpc.useUtils();

  const createMutation = trpc.viewer.availability.schedule.create.useMutation({
    onSuccess: async ({ schedule }) => {
      await router.push(`/availability/${schedule.id}${fromEventType ? "?fromEventType=true" : ""}`);
      showToast(t("schedule_created_successfully", { scheduleName: schedule.name }), "success");
      revalidateAvailabilityList();
      utils.viewer.availability.list.setData(undefined, (data) => {
        const newSchedule = {
          ...schedule,
          timeZone: sanitizeTimezone(schedule.timeZone),
          isDefault: false,
          availability: [],
        };
        if (!data)
          return {
            schedules: [newSchedule],
          };
        return {
          ...data,
          schedules: [...data.schedules, newSchedule],
        };
      });
    },
    onError: (err) => {
      if (err instanceof HttpError) {
        const message = `${err.statusCode}: ${err.message}`;
        showToast(message, "error");
      }

      if (err.data?.code === "UNAUTHORIZED") {
        const message = `${err.data.code}: ${t("error_schedule_unauthorized_create")}`;
        showToast(message, "error");
      }
    },
  });

  return (
    <Dialog name={name} clearQueryParamsOnClose={["copy-schedule-id"]}>
      <DialogTrigger asChild>
        <Button variant="fab" data-testid={name} StartIcon="plus" size="sm">
          {t("new")}
        </Button>
      </DialogTrigger>
      <DialogContent title={t("add_new_schedule")}>
        <Form
          form={form}
          handleSubmit={(values) => {
            createMutation.mutate(values);
          }}>
          <InputField
            label={t("name")}
            type="text"
            id="name"
            required
            placeholder={t("default_schedule_name")}
            {...register("name", {
              setValueAs: (v) => (!v || v.trim() === "" ? null : v),
            })}
          />
          <DialogFooter>
            <DialogClose />
            <Button type="submit" loading={createMutation.isPending}>
              {t("continue")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
