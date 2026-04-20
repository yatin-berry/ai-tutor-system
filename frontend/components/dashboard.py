import streamlit as st
import pandas as pd
from frontend.services.api_service import get_dashboard
import plotly.express as px


def render_dashboard():
    user = getattr(st.session_state, "user", None)
    email = user["email"] if hasattr(user, "email") else (user.get("email") if isinstance(user, dict) else "Student")
    
    st.title("📊 Personal Performance Dashboard")
    st.caption(f"Welcome back, {email}! Here is your personalized performance overview.")

    with st.spinner("⏳ Compiling your analytics dashboard..."):
        data = get_dashboard()
    
    if "detail" in data:
        st.error(f"Error fetching dashboard: {data['detail']}")
        return

    # 🔹 QUIZ METRICS
    st.subheader("Quiz Performance")

    col1, col2, col3 = st.columns(3)

    with col1:
        st.metric("Total Attempts", data.get("total_quiz_attempts", 0))

    with col2:
        st.metric("Avg Score", data.get("average_quiz_score", 0))

    with col3:
        st.metric("Avg Accuracy", f"{data.get('average_accuracy', 0)}%")

    recent_quiz = data.get("recent_quiz", [])
    if recent_quiz:
        st.markdown("<br>", unsafe_allow_html=True)
        plot_data = pd.DataFrame(recent_quiz[::-1])
        plot_data['Attempt'] = range(1, len(plot_data) + 1)
        
        fig_progress = px.line(
            plot_data,
            x="Attempt",
            y="total_score",
            title="Learning Progress (Last 10 Attempts)",
            markers=True,
            line_shape="spline",
            render_mode="svg"
        )
        fig_progress.update_traces(line_color='#7c3aed', marker=dict(size=10, color='white', line=dict(width=2, color='#7c3aed')))
        fig_progress.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
            font_color='#cbd5e1',
            xaxis=dict(showgrid=False),
            yaxis=dict(showgrid=True, gridcolor='rgba(255,255,255,0.05)')
        )
        st.plotly_chart(fig_progress, use_container_width=True)

    subject_stats = data.get("subject_stats", [])

    if subject_stats:
        st.markdown("---")
        st.subheader("Subject-wise Performance")

        df_subj = pd.DataFrame(subject_stats)
        df_subj.index = df_subj.index + 1 
        
        display_subj = df_subj.copy()
        display_subj.columns = [col.replace("_", " ").title() for col in display_subj.columns]
        
        st.dataframe(display_subj, use_container_width=True)

        if not df_subj.empty:
            fig = px.bar(
                df_subj,
                x="subject",
                y="average_score",
                color="average_score",
                color_continuous_scale="blues",
                title="Average Score by Subject",
                labels={"subject": "Subject", "average_score": "Average Score"}
            )
            st.plotly_chart(fig, use_container_width=True)

    st.markdown("---")
    st.subheader("Interview Performance")

    col1, col2 = st.columns(2)

    with col1:
        st.metric("Total Interviews", data.get("total_interviews", 0))

    with col2:
        st.metric("Avg Interview Score", data.get("average_interview_score", 0))

    role_stats = data.get("role_stats", [])

    if role_stats:
        st.markdown("---")
        st.subheader("Role-wise Performance")

        df_role = pd.DataFrame(role_stats)
        df_role.index = df_role.index + 1  
        display_role = df_role.copy()
        display_role.columns = [col.replace("_", " ").title() for col in display_role.columns]
        
        st.dataframe(display_role, use_container_width=True)

        if not df_role.empty:
            fig = px.bar(
                df_role,
                x="role",
                y="average_score",
                color="average_score",
                color_continuous_scale="viridis",
                title="Interview Performance by Role",
                labels={"role": "Role", "average_score": "Average Score"}
            )
            st.plotly_chart(fig, use_container_width=True)