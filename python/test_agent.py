#!/usr/bin/env python3
"""
Unit and Integration Tests for GENISUS Astra AI Developer Subsystem.
Verifies:
1. Dynamic planning & requirement decomposition (English & Tamil)
2. Repository and build tool auto-detection
3. Impact & 6-Factor Safety Evaluation
4. Build/Test command execution
5. Git staging and commit creation in a clean isolated test repository
"""

import unittest
import tempfile
import shutil
import subprocess
import os
from pathlib import Path
from astra_dev_agent import AstraDevAgent, EXECUTION_MODES, RISK_LEVELS


class TestAstraDevAgent(unittest.TestCase):
    def setUp(self):
        # Create a temporary directory mimicking a real repository
        self.test_dir = tempfile.mkdtemp(prefix="genisus_test_repo_")
        self.repo_path = Path(self.test_dir).resolve()
        
        # Initialize git repo
        subprocess.run(["git", "init"], cwd=self.test_dir, check=True, capture_output=True)
        subprocess.run(["git", "config", "user.name", "Genisus Test"], cwd=self.test_dir, check=True, capture_output=True)
        subprocess.run(["git", "config", "user.email", "test@genisus.ai"], cwd=self.test_dir, check=True, capture_output=True)
        
        # Initial commit
        readme = self.repo_path / "README.md"
        readme.write_text("# Test Repo\n", encoding="utf-8")
        subprocess.run(["git", "add", "."], cwd=self.test_dir, check=True, capture_output=True)
        subprocess.run(["git", "commit", "-m", "chore: initial commit"], cwd=self.test_dir, check=True, capture_output=True)

    def tearDown(self):
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def test_stage_1_planning_english_and_tamil(self):
        agent = AstraDevAgent(project_path=self.test_dir, verbose=False)
        
        # English directive
        plan_en = agent.stage_1_plan("Fix crash in payment service and run tests")
        self.assertEqual(plan_en["intent"], "BUG_FIX")
        self.assertFalse(plan_en["isTamil"])
        self.assertEqual(len(plan_en["steps"]), 7)

        # Tamil directive
        plan_ta = agent.stage_1_plan("டாஷ்போர்டில் புதிய பயனர் அட்டவணையை சரிசெய்")
        self.assertTrue(plan_ta["isTamil"])

    def test_stage_2_repo_analysis(self):
        agent = AstraDevAgent(project_path=self.test_dir, verbose=False)
        agent.stage_1_plan("Repository inspection")
        repo_info = agent.stage_2_repo_analysis()
        
        self.assertTrue(repo_info["isGit"])
        self.assertIn("branch", repo_info)
        self.assertEqual(repo_info["projectPath"], str(self.repo_path))

    def test_stage_3_safety_gate(self):
        agent_assisted = AstraDevAgent(project_path=self.test_dir, mode=EXECUTION_MODES["ASSISTED"], verbose=False)
        agent_assisted.stage_1_plan("Test safety gate")
        agent_assisted.stage_2_repo_analysis()
        dec_assisted = agent_assisted.stage_3_impact_safety()
        self.assertEqual(dec_assisted["authorization"], "GATED_ASSISTED")

        agent_auto = AstraDevAgent(project_path=self.test_dir, mode=EXECUTION_MODES["AUTONOMOUS"], verbose=False)
        agent_auto.stage_1_plan("Test safety gate autonomous")
        agent_auto.stage_2_repo_analysis()
        dec_auto = agent_auto.stage_3_impact_safety()
        self.assertEqual(dec_auto["authorization"], "GRANTED_AUTONOMOUS")

    def test_stage_4_and_6_codegen_and_commit(self):
        agent = AstraDevAgent(project_path=self.test_dir, mode=EXECUTION_MODES["AUTONOMOUS"], verbose=False)
        agent.stage_1_plan("Add health check utility")
        agent.stage_2_repo_analysis()
        agent.stage_3_impact_safety()
        
        # Modify a file
        modified = agent.stage_4_code_generation("Add health check utility")
        self.assertTrue(len(modified) > 0)
        
        # Commit the modification
        commit_res = agent.stage_6_git_commit()
        self.assertTrue(commit_res["committed"])
        self.assertIsNotNone(commit_res["sha"])
        self.assertIn("feat(autonomous):", commit_res["message"])


if __name__ == "__main__":
    unittest.main()
