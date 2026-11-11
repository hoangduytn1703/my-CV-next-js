/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { IconCopy, IconDown, IconPlus, IconTrash, IconUp, IconUpload } from "components/admin/icons";
import type { Field } from "components/admin/schema";
import { TechIcon } from "components/fx/TechIcon";
import { ChangeEvent, useRef, useState } from "react";

type Upload = (file: File) => Promise<{ path: string; preview: string }>;

export interface FieldProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  upload: Upload;
  previews: Record<string, string>;
}

const Help = ({ text }: { text?: string }) =>
  text ? (
    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5, ml: 0.25 }}>
      {text}
    </Typography>
  ) : null;

const move = <T,>(list: T[], from: number, to: number) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);

  return next;
};

/* ------------------------------ chips ------------------------------ */

const ChipsInput = ({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  help?: string;
}) => (
  <Box>
    <Autocomplete
      multiple
      freeSolo
      options={[] as string[]}
      value={value}
      onChange={(_e, v) => onChange((v as string[]).map((s) => s.trim()).filter(Boolean))}
      renderTags={(tags, getTagProps) =>
        tags.map((tag, index) => {
          const { key, ...rest } = getTagProps({ index });

          return (
            <Chip
              key={key}
              label={tag}
              size="small"
              icon={<TechIcon name={tag} className="admin-chip-icon" />}
              {...rest}
            />
          );
        })
      }
      renderInput={(params) => <TextField {...params} label={label} placeholder="Type and press Enter" />}
    />
    <Help text={help} />
  </Box>
);

/* ------------------------------ lines ------------------------------ */

const LinesInput = ({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { type: "lines" }>;
  value: string[];
  onChange: (v: string[]) => void;
}) => (
  <Box>
    <Typography variant="subtitle2" sx={{ mb: 1 }}>
      {field.label}
    </Typography>
    <Stack spacing={1}>
      {value.map((line, i) => (
        <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
          <TextField
            fullWidth
            multiline
            size="small"
            value={line}
            onChange={(e) => onChange(value.map((l, j) => (j === i ? e.target.value : l)))}
          />
          <Tooltip title="Remove">
            <IconButton size="small" onClick={() => onChange(value.filter((_, j) => j !== i))}>
              <IconTrash />
            </IconButton>
          </Tooltip>
        </Stack>
      ))}
    </Stack>
    <Button size="small" startIcon={<IconPlus />} sx={{ mt: 1 }} onClick={() => onChange([...value, ""])}>
      {field.addLabel ?? "Add line"}
    </Button>
    <Help text={field.help} />
  </Box>
);

/* ------------------------------ file ------------------------------ */

const FileInput = ({
  field,
  value,
  onChange,
  upload,
  previews,
}: FieldProps & { field: Extract<Field, { type: "file" }> }) => {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const src = previews[value] || value;
  const isPlaceholder = !value || String(value).includes("placeholder");

  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const { path } = await upload(file);
      onChange(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
        {field.accept === "image" && (
          <Box
            sx={{
              width: 96,
              height: 64,
              flexShrink: 0,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "rgba(255,255,255,0.04)",
              backgroundImage: isPlaceholder ? "none" : `url("${src}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "grid",
              placeItems: "center",
              color: "text.secondary",
              fontSize: 11,
            }}
          >
            {isPlaceholder && "No image"}
          </Box>
        )}
        <TextField
          fullWidth
          size="small"
          label={field.label}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
        <Stack direction="row" spacing={1} flexShrink={0}>
          <Button variant="outlined" startIcon={<IconUpload />} disabled={busy} onClick={() => input.current?.click()}>
            {busy ? "Uploading…" : "Upload"}
          </Button>
          {field.accept === "pdf" && value && (
            <Button href={src} target="_blank" rel="noreferrer">
              Open
            </Button>
          )}
          {field.accept === "image" && value && (
            <Button color="inherit" onClick={() => onChange("")}>
              Clear
            </Button>
          )}
        </Stack>
      </Stack>
      <input
        ref={input}
        type="file"
        hidden
        accept={field.accept === "pdf" ? "application/pdf" : "image/png,image/jpeg,image/webp,image/gif"}
        onChange={pick}
      />
      {error && (
        <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
          {error}
        </Typography>
      )}
      <Help text={field.help} />
    </Box>
  );
};

/* ------------------------------ list ------------------------------ */

const ListInput = ({
  field,
  value,
  onChange,
  upload,
  previews,
}: FieldProps & { field: Extract<Field, { type: "list" }> }) => {
  const items: any[] = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState<number | false>(false);

  const update = (i: number, next: any) => onChange(items.map((it, j) => (j === i ? next : it)));
  const add = () => {
    onChange([...items, field.create()]);
    setOpen(items.length);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          {field.label}{" "}
          <Typography component="span" variant="body2" color="text.secondary">
            ({items.length})
          </Typography>
        </Typography>
      </Stack>
      <Help text={field.help} />
      <Stack spacing={1} sx={{ mt: 1 }}>
        {items.map((item, i) => (
          <Accordion
            key={i}
            expanded={open === i}
            onChange={(_e, isOpen) => setOpen(isOpen ? i : false)}
            disableGutters
            TransitionProps={{ unmountOnExit: true }}
          >
            <AccordionSummary>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: "100%", minWidth: 0 }}>
                <Typography variant="caption" sx={{ fontFamily: "var(--font-mono)", color: "text.secondary" }}>
                  {String(i + 1).padStart(2, "0")}
                </Typography>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography noWrap fontWeight={600}>
                    {field.title(item, i)}
                  </Typography>
                  {field.subtitle && (
                    <Typography noWrap variant="caption" color="text.secondary" component="div">
                      {field.subtitle(item)}
                    </Typography>
                  )}
                </Box>
                <Stack direction="row" spacing={0.25} onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Move up">
                    <span>
                      <IconButton size="small" disabled={i === 0} onClick={() => onChange(move(items, i, i - 1))}>
                        <IconUp />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Move down">
                    <span>
                      <IconButton
                        size="small"
                        disabled={i === items.length - 1}
                        onClick={() => onChange(move(items, i, i + 1))}
                      >
                        <IconDown />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Duplicate">
                    <IconButton
                      size="small"
                      onClick={() =>
                        onChange([...items.slice(0, i + 1), JSON.parse(JSON.stringify(item)), ...items.slice(i + 1)])
                      }
                    >
                      <IconCopy />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        if (window.confirm(`Delete “${field.title(item, i)}”?`)) {
                          onChange(items.filter((_, j) => j !== i));
                          setOpen(false);
                        }
                      }}
                    >
                      <IconTrash />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Fields
                fields={field.item}
                value={item}
                onChange={(next) => update(i, next)}
                upload={upload}
                previews={previews}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
      <Button startIcon={<IconPlus />} sx={{ mt: 1.5 }} variant="outlined" onClick={add}>
        {field.addLabel ?? "Add item"}
      </Button>
    </Box>
  );
};

/* ------------------------------ dispatcher ------------------------------ */

export const FieldInput = (props: FieldProps) => {
  const { field, value, onChange } = props;
  switch (field.type) {
    case "text":
      return (
        <Box>
          <TextField
            fullWidth
            label={field.label}
            value={value ?? ""}
            placeholder={field.placeholder}
            multiline={field.multiline}
            minRows={field.rows}
            onChange={(e) => onChange(e.target.value)}
          />
          <Help text={field.help} />
        </Box>
      );
    case "number":
      return (
        <Box>
          <TextField
            type="number"
            label={field.label}
            value={value ?? 0}
            inputProps={{ min: field.min, max: field.max }}
            onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
            sx={{ width: 220 }}
          />
          <Help text={field.help} />
        </Box>
      );
    case "bool":
      return (
        <Box>
          <FormControlLabel
            control={<Switch checked={!!value} onChange={(e) => onChange(e.target.checked)} />}
            label={field.label}
          />
          <Help text={field.help} />
        </Box>
      );
    case "select":
      return (
        <Box>
          <TextField
            select
            label={field.label}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            sx={{ minWidth: 240 }}
          >
            {field.options.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
          <Help text={field.help} />
        </Box>
      );
    case "color":
      return (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            component="input"
            type="color"
            value={value || "#34d399"}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            sx={{ width: 48, height: 40, p: 0, border: 0, bgcolor: "transparent", cursor: "pointer" }}
          />
          <TextField size="small" label={field.label} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
        </Stack>
      );
    case "tags":
      return (
        <ChipsInput
          label={field.label}
          help={field.help}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
        />
      );
    case "csv":
      return (
        <ChipsInput
          label={field.label}
          help={field.help}
          value={String(value ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)}
          onChange={(v) => onChange(v.join(", "))}
        />
      );
    case "lines":
      return <LinesInput field={field} value={Array.isArray(value) ? value : []} onChange={onChange} />;
    case "file":
      return <FileInput {...props} field={field} />;
    case "group":
      return <Fields {...props} fields={field.fields} />;
    case "list":
      return <ListInput {...props} field={field} />;
  }
};

/** Renders a set of fields bound to the keys of `value`. */
export const Fields = ({
  fields,
  value,
  onChange,
  upload,
  previews,
}: {
  fields: Field[];
  value: any;
  onChange: (v: any) => void;
  upload: Upload;
  previews: Record<string, string>;
}) => (
  <Stack spacing={2.5}>
    {fields.map((f) => (
      <FieldInput
        key={f.key}
        field={f}
        value={value?.[f.key]}
        onChange={(v) => onChange({ ...value, [f.key]: v })}
        upload={upload}
        previews={previews}
      />
    ))}
  </Stack>
);
