"""Streamlit UI for Wazuh ticket CRUD over the `wazuh-tickets` index."""

from __future__ import annotations

import json

import pandas as pd
import streamlit as st

from ticket_service import TICKET_LIST_FIELDS, get_ticket, list_tickets, update_ticket

st.set_page_config(page_title="Wazuh Ticketing MVP", layout="wide")
st.title("Wazuh Ticketing - MVP")

# Sidebar filters and pagination controls
st.sidebar.header("Filters")
agent_name_filter = st.sidebar.text_input("agent_name")
src_ip_filter = st.sidebar.text_input("src_ip")
rule_level_filter = st.sidebar.number_input("rule_level >=", min_value=0, value=0, step=1)
status_filter = st.sidebar.selectbox("status", options=["", "open", "investigating", "closed"])

st.sidebar.header("Pagination")
page_size = st.sidebar.number_input("Page size", min_value=1, max_value=50, value=50, step=1)
page_number = st.sidebar.number_input("Page", min_value=0, value=0, step=1)

# Query tickets (source filtered to fields needed by table)
response = list_tickets(
    agent_name=agent_name_filter or None,
    src_ip=src_ip_filter or None,
    min_rule_level=int(rule_level_filter) if rule_level_filter > 0 else None,
    status=status_filter or None,
    page=int(page_number),
    page_size=int(page_size),
)

hits = response.get("hits", {}).get("hits", [])
total_hits = response.get("hits", {}).get("total", {})
if isinstance(total_hits, dict):
    total_value = total_hits.get("value", 0)
else:
    total_value = int(total_hits)

rows: list[dict[str, str | int | None]] = []
for hit in hits:
    source = hit.get("_source", {})
    row = {field: source.get(field) for field in TICKET_LIST_FIELDS}
    row["_id"] = hit.get("_id")
    rows.append(row)

st.subheader(f"Tickets ({total_value} total matches)")

if not rows:
    st.info("No tickets found for the selected filters.")
    st.stop()

columns = ["timestamp", "agent_name", "rule_description", "rule_level", "src_ip", "status", "_id"]
df = pd.DataFrame(rows)[columns]

# Row selection behavior: click a row, rerun, and render detail panel below
selection = st.dataframe(
    df,
    use_container_width=True,
    hide_index=True,
    on_select="rerun",
    selection_mode="single-row",
)

selected_rows = selection.selection.get("rows", [])
if selected_rows:
    selected_row = rows[selected_rows[0]]
    selected_ticket_id = selected_row["_id"]
else:
    selected_ticket_id = rows[0]["_id"]

with st.expander("Ticket detail and actions", expanded=True):
    st.markdown(f"**Ticket ID:** `{selected_ticket_id}`")

    ticket_document = get_ticket(selected_ticket_id)

    st.markdown("### Full JSON document")
    st.code(json.dumps(ticket_document, indent=2, default=str), language="json")

    additional_fields = {
        key: value
        for key, value in ticket_document.items()
        if key not in set(TICKET_LIST_FIELDS)
    }
    if additional_fields:
        st.markdown("### Additional fields")
        st.json(additional_fields)

    st.markdown("### Update ticket")
    current_status = ticket_document.get("status", "open")
    status_options = ["open", "investigating", "closed"]
    status_index = status_options.index(current_status) if current_status in status_options else 0

    with st.form("ticket-update-form"):
        new_status = st.selectbox("Status", options=status_options, index=status_index)
        new_assigned_analyst = st.text_input(
            "Assigned analyst",
            value=ticket_document.get("assigned_analyst", ""),
        )
        new_notes = st.text_area(
            "Investigation notes",
            value=ticket_document.get("investigation_notes", ""),
            height=120,
        )
        submitted = st.form_submit_button("Save updates")

    if submitted:
        payload = {
            "status": new_status,
            "assigned_analyst": new_assigned_analyst,
            "investigation_notes": new_notes,
        }
        update_ticket(selected_ticket_id, payload)
        st.success("Ticket updated in OpenSearch.")
        st.rerun()
