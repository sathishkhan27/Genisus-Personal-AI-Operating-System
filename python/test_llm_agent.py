#!/usr/bin/env python3
"""
Unit Tests for Python LLM Task & Activity Engine.
Tests task decomposition, background persistence, logical step execution, and engine telemetry.
"""

import os
import unittest
import tempfile
from llm_task_agent import LLMTaskAgent, TaskStateStore


class TestLLMTaskAgent(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_state_file = os.path.join(self.temp_dir.name, "test_tasks.json")
        self.store = TaskStateStore(self.temp_state_file)
        self.agent = LLMTaskAgent(store=self.store)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_engineering_task_decomposition(self):
        task = self.agent.decompose_task("Build GraphQL API for user checkout and run tests", priority="HIGH")
        self.assertEqual(task["category"], "Engineering")
        self.assertEqual(task["priority"], "HIGH")
        self.assertTrue(len(task["activities"]) >= 3)
        self.assertEqual(task["activities"][0]["agent"], "CodingAgent")

    def test_market_task_decomposition(self):
        task = self.agent.decompose_task("Research pricing models for SaaS billing and market demand", priority="MEDIUM")
        self.assertEqual(task["category"], "Finance & Market")
        self.assertTrue(any(a["agent"] == "RevenueAgent" for a in task["activities"]))

    def test_general_task_decomposition(self):
        task = self.agent.decompose_task("Organize quarterly team sync and review milestones")
        self.assertEqual(task["category"], "Operations")
        self.assertEqual(task["status"], "ACTIVE")
        self.assertIn("mins", task["totalEstimatedTime"])

    def test_background_persistence(self):
        task = self.agent.decompose_task("Deploy payment microservice")
        retrieved = self.store.get_task(task["id"])
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved["id"], task["id"])
        self.assertEqual(retrieved["status"], "ACTIVE")

    def test_background_step_execution(self):
        task = self.agent.decompose_task("Refactor authentication module")
        task_id = task["id"]

        # Step 1
        updated = self.agent.step_task(task_id)
        self.assertIsNotNone(updated)
        self.assertGreater(updated["progress"], 0)
        self.assertEqual(updated["activities"][0]["status"], "COMPLETED")
        self.assertTrue(len(updated["executionHistory"]) >= 1)

    def test_run_all_steps_completion(self):
        task = self.agent.decompose_task("Run security audit and verification")
        task_id = task["id"]

        completed = self.agent.run_all_steps(task_id)
        self.assertIsNotNone(completed)
        self.assertEqual(completed["status"], "COMPLETED")
        self.assertEqual(completed["progress"], 100)
        for act in completed["activities"]:
            self.assertEqual(act["status"], "COMPLETED")

    def test_engine_telemetry_status(self):
        self.agent.decompose_task("Task 1 for status test")
        status = self.agent.get_status()
        self.assertEqual(status["status"], "OPERATIONAL")
        self.assertGreaterEqual(status["totalTasks"], 1)
        self.assertGreaterEqual(status["activeTasksCount"], 1)


if __name__ == "__main__":
    unittest.main()

